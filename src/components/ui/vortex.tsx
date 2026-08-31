'use client'

import { cn } from '@/lib/utils'
import React, { useCallback, useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'
import { motion } from 'motion/react'

/**
 * A noise-driven particle field, adapted from the Aceternity "Vortex".
 *
 * Six changes from the original, each for a reason:
 *
 *  1. THEME AWARE. The original hardcodes a black ground, which would have
 *     swapped one black hero for another. Ground and particle lightness are
 *     read per theme, so the hero can finally follow light/dark instead of
 *     being pinned dark over a photograph.
 *  2. BRAND HUE. Base hue 220 is a generic blue. The wordmark gradient runs
 *     #00dc82 -> #155799, which is hue 155 -> 208, so the field traces the
 *     brand's own two colours rather than arriving with a third.
 *  3. REDUCED MOTION. A full-viewport animation that ignores
 *     prefers-reduced-motion is not acceptable on a page anyone has to read.
 *     One frame is painted and the loop never starts.
 *  4. DEVICE PIXEL RATIO and CONTAINER SIZE. The original sizes the canvas to
 *     window.innerWidth/Height whatever its container is, and ignores DPR, so
 *     it renders soft on any retina display.
 *  5. IT STOPS. Two full-canvas blur composites per frame over 700 particles
 *     is real work; the original runs it forever, including while the hero is
 *     scrolled out of view and while the tab is in the background.
 *  6. useRef<number>() -> useRef<number | null>(null), which is the honest type.
 */

interface VortexProps {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  particleCount?: number
  rangeY?: number
  baseHue?: number
  rangeHue?: number
  baseSpeed?: number
  rangeSpeed?: number
  baseRadius?: number
  rangeRadius?: number
  /** Canvas ground. Defaults to the page background token, so it follows the theme. */
  backgroundColor?: string
  /** Particle lightness in %. Lower reads better on a light ground. */
  lightness?: number
  /** Peak particle alpha. */
  alpha?: number
}

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameId = useRef<number | null>(null)
  const runningRef = useRef(false)

  const particleCount = props.particleCount ?? 640
  const particlePropCount = 9
  const particlePropsLength = particleCount * particlePropCount
  const rangeY = props.rangeY ?? 120
  const baseTTL = 50
  const rangeTTL = 150
  const baseSpeed = props.baseSpeed ?? 0.0
  const rangeSpeed = props.rangeSpeed ?? 1.5
  const baseRadius = props.baseRadius ?? 1
  const rangeRadius = props.rangeRadius ?? 2
  // 155 is #00dc82, 208 is #155799: the wordmark gradient, as a field.
  const baseHue = props.baseHue ?? 155
  const rangeHue = props.rangeHue ?? 53
  const noiseSteps = 3
  const xOff = 0.00125
  const yOff = 0.00125
  const zOff = 0.0005

  const tickRef = useRef(0)
  const centerRef = useRef<[number, number]>([0, 0])
  const propsRef = useRef<Float32Array>(new Float32Array(particlePropsLength))
  const noise3D = useRef(createNoise3D()).current

  const TAU = 2 * Math.PI
  const rand = (n: number) => n * Math.random()
  const randRange = (n: number) => n - rand(2 * n)
  const fadeInOut = (t: number, m: number) => {
    const hm = 0.5 * m
    return Math.abs(((t + hm) % m) - hm) / hm
  }
  const lerp = (n1: number, n2: number, speed: number) => (1 - speed) * n1 + speed * n2

  // Resolved once per paint rather than per particle: reading a custom property
  // off the document is a style recalc, and this runs 640 times a frame.
  const themeRef = useRef({ ground: '#0a0a0a', lightness: 60, alpha: 1, light: false })
  const readTheme = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const cs = getComputedStyle(el)
    const bg = cs.getPropertyValue('--background').trim()
    const light =
      document.documentElement.getAttribute('data-theme') === 'light' ||
      (!document.documentElement.getAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: light)').matches)
    themeRef.current = {
      ground: props.backgroundColor ?? (bg ? `hsl(${bg})` : light ? '#fbfbfa' : '#0a0a0a'),
      // On a light ground a 60% particle is invisible; on a dark one a 40% one is mud.
      lightness: props.lightness ?? (light ? 34 : 60),
      alpha: props.alpha ?? (light ? 0.8 : 1),
      light,
    }
  }, [props.backgroundColor, props.lightness, props.alpha])

  const initParticle = useCallback(
    (i: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const p = propsRef.current
      const dpr = window.devicePixelRatio || 1
      p.set(
        [
          rand(canvas.width / dpr),
          centerRef.current[1] + randRange(rangeY),
          0,
          0,
          0,
          baseTTL + rand(rangeTTL),
          baseSpeed + rand(rangeSpeed),
          baseRadius + rand(rangeRadius),
          baseHue + rand(rangeHue),
        ],
        i,
      )
    },
    [baseHue, rangeHue, baseRadius, rangeRadius, baseSpeed, rangeSpeed, rangeY],
  )

  const initParticles = useCallback(() => {
    tickRef.current = 0
    propsRef.current = new Float32Array(particlePropsLength)
    for (let i = 0; i < particlePropsLength; i += particlePropCount) initParticle(i)
  }, [initParticle, particlePropsLength])

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    // The CONTAINER, not the window, and at device resolution.
    const { width, height } = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.floor(width * dpr))
    canvas.height = Math.max(1, Math.floor(height * dpr))
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    centerRef.current = [0.5 * width, 0.5 * height]
  }, [])

  const paint = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      const { ground, lightness, alpha, light } = themeRef.current
      tickRef.current++

      // Cleared to TRANSPARENT, and the ground goes in last. The glow below
      // composites the whole canvas onto itself with brightness(200%), so
      // anything already painted gets amplified along with the particles: a
      // #0a0a0a ground goes 10 -> 30 -> 90 and the hero greys out. The stock
      // component hides this because its default ground is pure black, where
      // 0 x 2 = 0 is a fixed point; every other colour lifts.
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'

      const p = propsRef.current
      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        const x = p[i]
        const y = p[i + 1]
        const n = noise3D(x * xOff, y * yOff, tickRef.current * zOff) * noiseSteps * TAU
        const vx = lerp(p[i + 2], Math.cos(n), 0.5)
        const vy = lerp(p[i + 3], Math.sin(n), 0.5)
        const life = p[i + 4]
        const ttl = p[i + 5]
        const speed = p[i + 6]
        const x2 = x + vx * speed
        const y2 = y + vy * speed

        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineWidth = p[i + 7]
        ctx.strokeStyle = `hsla(${p[i + 8]},100%,${lightness}%,${fadeInOut(life, ttl) * alpha})`
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
        ctx.restore()

        p[i] = x2
        p[i + 1] = y2
        p[i + 2] = vx
        p[i + 3] = vy
        p[i + 4] = life + 1
        if (x2 > w || x2 < 0 || y2 > h || y2 < 0 || life + 1 > ttl) initParticle(i)
      }

      // The bloom, and it has to be a different operation per theme.
      //
      // 'lighter' ADDS colour. On the near-black ground that is the glow the
      // effect is built around; on a near-white one every channel saturates to
      // 255 on the first pass and the whole field disappears. The light theme
      // therefore blooms by DARKENING instead: multiplying a blurred copy
      // leaves the white ground untouched (white x white is white) and lets the
      // strokes bleed into it, which is the same gesture read the other way up.
      if (light) {
        // On transparent, a soft halo rather than a darkening pass: the ground
        // is not there yet to multiply against.
        ctx.save()
        ctx.filter = 'blur(6px)'
        ctx.globalAlpha = 0.55
        ctx.drawImage(canvas, 0, 0, w, h)
        ctx.restore()
      } else {
        ctx.save()
        ctx.filter = 'blur(8px) brightness(200%)'
        ctx.globalCompositeOperation = 'lighter'
        ctx.drawImage(canvas, 0, 0, w, h)
        ctx.restore()
        ctx.save()
        ctx.filter = 'blur(4px) brightness(200%)'
        ctx.globalCompositeOperation = 'lighter'
        ctx.drawImage(canvas, 0, 0, w, h)
        ctx.restore()
      }

      // The ground, painted BEHIND everything now that the glow has run, so it
      // is exactly the theme's background and nothing has amplified it.
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = ground
      ctx.fillRect(0, 0, w, h)
      ctx.restore()
    },
    [initParticle, particlePropsLength, noise3D],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    resize()
    readTheme()
    initParticles()

    const loop = () => {
      if (!runningRef.current) return
      paint(canvas, ctx)
      animationFrameId.current = window.requestAnimationFrame(loop)
    }
    const start = () => {
      if (runningRef.current || reduced.matches) return
      runningRef.current = true
      animationFrameId.current = window.requestAnimationFrame(loop)
    }
    const stop = () => {
      runningRef.current = false
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }

    if (reduced.matches) {
      // One frame, no loop: the field is still there, it simply holds still.
      for (let k = 0; k < 90; k++) paint(canvas, ctx)
    } else {
      start()
    }

    // Only while it is on screen, and only while the tab is in front.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 },
    )
    io.observe(container)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    const onResize = () => {
      resize()
      readTheme()
      initParticles()
    }
    window.addEventListener('resize', onResize)

    // The reader can flip the theme while looking at it.
    const mo = new MutationObserver(readTheme)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const scheme = window.matchMedia('(prefers-color-scheme: light)')
    scheme.addEventListener('change', readTheme)

    return () => {
      stop()
      io.disconnect()
      mo.disconnect()
      scheme.removeEventListener('change', readTheme)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
    }
  }, [initParticles, paint, readTheme, resize])

  return (
    <div className={cn('relative h-full w-full', props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        ref={containerRef}
        className="absolute inset-0 z-0 h-full w-full bg-transparent"
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </motion.div>

      <div className={cn('relative z-10', props.className)}>{props.children}</div>
    </div>
  )
}
