import { createHighlighter, type Highlighter } from 'shiki'

type SupportedLang = 'python' | 'sh' | 'bash'

declare global {
  // eslint-disable-next-line no-var
  var __shikiHighlighter: Highlighter | undefined
}

async function getHighlighter(): Promise<Highlighter> {
  if (globalThis.__shikiHighlighter) return globalThis.__shikiHighlighter
  globalThis.__shikiHighlighter = await createHighlighter({
    themes: ['github-dark-dimmed'],
    langs: ['python', 'sh', 'bash'],
  })
  return globalThis.__shikiHighlighter
}

export async function highlight(code: string, lang: SupportedLang): Promise<string> {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code, {
    lang,
    theme: 'github-dark-dimmed',
  })
}
