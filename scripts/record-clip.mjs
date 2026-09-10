/**
 * Record the MCP demo as an mp4, sized for a LinkedIn post.
 *
 *   npm run clip                     # 1080x1350 (4:5), the default
 *   CLIP_SIZE=1080x1080 npm run clip # square
 *
 * How it works: start the production server, open /demo/clip in the Chrome
 * already on the machine, and take a CDP screencast. Screencast frames arrive
 * when the page paints rather than on a clock, so each frame carries its own
 * timestamp and ffmpeg is fed a concat list with real per-frame durations. A
 * fixed frame rate would drift against the animation.
 *
 * There is no bundled browser and no puppeteer, the same trade the manual
 * pipeline makes: the machine already has Chrome.
 */
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
].filter(Boolean)

const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!chromePath) {
  console.error(
    'record-clip: no Chrome found. Install Google Chrome or set CHROME_PATH to the binary.'
  )
  process.exit(1)
}

if (spawnSync('ffmpeg', ['-version']).status !== 0) {
  console.error('record-clip: ffmpeg not on PATH. `brew install ffmpeg`.')
  process.exit(1)
}

// The viewport the page renders into. The window pins itself to 34rem by
// 37rem-plus-chrome inside this, and the recorder crops to whatever it
// measures, so the output ratio is the window's, not this box's.
const [W, H] = (process.env.CLIP_VIEWPORT ?? '1240x1800').split('x').map(Number)
// Output width. Height follows the window, so the clip is never stretched.
const OUT_W = Number(process.env.CLIP_WIDTH ?? 1080)
const SCALE = 1 // the page scales itself; see /demo/clip
const PORT = Number(process.env.CLIP_PORT ?? 3210)
const URL = `http://localhost:${PORT}/demo/clip`
const OUT = process.env.CLIP_OUT ?? 'oxynet-mcp-demo.mp4'
const FRAMES = join('.clip-frames')

// The run is 44.8 s; a couple of seconds either side covers the start delay and
// leaves the reveal on screen at the end.
const DURATION_MS = Number(process.env.CLIP_MS ?? 48000)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  rmSync(FRAMES, { recursive: true, force: true })
  mkdirSync(FRAMES, { recursive: true })

  console.log(`record-clip: serving ${URL}`)
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    stdio: 'ignore',
  })

  let ready = false
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(URL)
      if (res.ok) {
        ready = true
        break
      }
    } catch {
      /* not up yet */
    }
    await sleep(400)
  }
  if (!ready) {
    server.kill()
    console.error(
      'record-clip: the server never answered. Run `npm run build` first.'
    )
    process.exit(1)
  }

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    '--force-device-scale-factor=1',
    `--window-size=${W},${H}`,
    '--remote-debugging-port=9666',
    '--user-data-dir=/tmp/oxynet-clip-profile',
    'about:blank',
  ])
  chrome.stderr.on('data', () => {})

  let version
  for (let i = 0; i < 60; i++) {
    try {
      version = await (await fetch('http://127.0.0.1:9666/json/version')).json()
      break
    } catch {
      await sleep(250)
    }
  }
  if (!version) throw new Error('record-clip: Chrome did not expose a debugging port')

  const target = await (
    await fetch('http://127.0.0.1:9666/json/new?about:blank', { method: 'PUT' })
  ).json()
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r, { once: true }))

  let id = 0
  const pending = new Map()
  const frames = []

  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data)
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result)
      pending.delete(msg.id)
      return
    }
    if (msg.method === 'Page.screencastFrame') {
      const { data, sessionId, metadata } = msg.params
      frames.push({ data, at: metadata.timestamp })
      send('Page.screencastFrameAck', { sessionId })
    }
  })

  function send(method, params = {}) {
    const msgId = ++id
    return new Promise((resolve) => {
      pending.set(msgId, resolve)
      ws.send(JSON.stringify({ id: msgId, method, params }))
    })
  }

  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: W,
    height: H,
    deviceScaleFactor: SCALE,
    mobile: false,
  })
  await send('Page.navigate', { url: URL })
  await sleep(1500) // hydrate before the first frame

  // Measure the window rather than assuming it. Its chrome heights change
  // whenever the header or the transport bar does, and a hard-coded crop would
  // quietly start clipping the replay button.
  const { result } = await send('Runtime.evaluate', {
    expression: `(() => {
      const r = document.querySelector('[data-demo-window]').getBoundingClientRect()
      return JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height })
    })()`,
    returnByValue: true,
  })
  const box = JSON.parse(result.value)
  console.log(
    `record-clip: window ${Math.round(box.width)}x${Math.round(box.height)} css`
  )

  console.log(`record-clip: capturing ${DURATION_MS / 1000}s`)
  await send('Page.startScreencast', {
    format: 'jpeg',
    quality: 95,
    maxWidth: W * SCALE,
    maxHeight: H * SCALE,
    everyNthFrame: 1,
  })
  await sleep(DURATION_MS)
  await send('Page.stopScreencast')

  ws.close()
  chrome.kill()
  server.kill()

  if (frames.length < 2) {
    console.error('record-clip: no frames captured')
    process.exit(1)
  }

  // Write the frames and a concat list that holds each one for as long as it
  // was actually on screen.
  const lines = []
  for (let i = 0; i < frames.length; i++) {
    const name = `f${String(i).padStart(5, '0')}.jpg`
    writeFileSync(join(FRAMES, name), Buffer.from(frames[i].data, 'base64'))
    const next = frames[i + 1]
    const dur = next ? Math.max(0.001, next.at - frames[i].at) : 1 / 30
    lines.push(`file '${name}'`, `duration ${dur.toFixed(4)}`)
  }
  // The concat demuxer ignores the last duration unless the file repeats.
  lines.push(`file '${`f${String(frames.length - 1).padStart(5, '0')}.jpg`}'`)
  writeFileSync(join(FRAMES, 'list.txt'), lines.join('\n'))

  // What size did the frames actually come back at? Scale the measured CSS box
  // by that, and clamp so a rounding error cannot push the crop off the edge.
  const probe = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'stream=width,height',
    '-of', 'csv=p=0',
    join(FRAMES, 'f00000.jpg'),
  ])
  const [frameW, frameH] = probe.stdout.toString().trim().split(',').map(Number)
  const k = frameW / W
  const crop = {
    w: Math.min(frameW, Math.round(box.width * k / 2) * 2),
    h: Math.min(frameH, Math.round(box.height * k / 2) * 2),
    x: Math.max(0, Math.round(box.x * k)),
    y: Math.max(0, Math.round(box.y * k)),
  }
  crop.x = Math.min(crop.x, frameW - crop.w)
  crop.y = Math.min(crop.y, frameH - crop.h)
  const outH = Math.round((OUT_W * crop.h) / crop.w / 2) * 2
  console.log(
    `record-clip: frames ${frameW}x${frameH}, crop ${crop.w}x${crop.h} ` +
      `at ${crop.x},${crop.y}, output ${OUT_W}x${outH}`
  )

  console.log(`record-clip: encoding ${frames.length} frames`)
  const ff = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', join(FRAMES, 'list.txt'),
      // The screencast hands back full-range JPEG. Convert to limited range
      // rather than just tagging it, or the blacks shift in some players.
      '-vf',
      `fps=30,crop=${crop.w}:${crop.h}:${crop.x}:${crop.y},` +
        `scale=${OUT_W}:${outH}:flags=lanczos:in_range=full:out_range=limited,format=yuv420p`,
      '-color_range', 'tv',
      '-colorspace', 'bt709',
      '-color_primaries', 'bt709',
      '-color_trc', 'bt709',
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', '20',
      // LinkedIn re-encodes anything it does not recognise; these are the safe
      // settings for in-feed playback.
      '-profile:v', 'high',
      '-level', '4.0',
      '-movflags', '+faststart',
      OUT,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  )
  if (ff.status !== 0) {
    console.error(ff.stderr?.toString().split('\n').slice(-12).join('\n'))
    process.exit(1)
  }

  rmSync(FRAMES, { recursive: true, force: true })
  console.log(`record-clip: wrote ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
