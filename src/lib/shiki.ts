import { createHighlighter, type Highlighter } from 'shiki'

type SupportedLang = 'python' | 'sh' | 'bash'

let highlighterInstance: Highlighter | null = null

export async function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) return highlighterInstance
  highlighterInstance = await createHighlighter({
    themes: ['github-dark-dimmed'],
    langs: ['python', 'sh', 'bash'],
  })
  return highlighterInstance
}

export async function highlight(code: string, lang: SupportedLang): Promise<string> {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code, {
    lang,
    theme: 'github-dark-dimmed',
  })
}
