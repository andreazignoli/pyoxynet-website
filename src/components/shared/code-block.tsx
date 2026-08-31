import { highlight } from '@/lib/shiki'
import type { CodeLang } from '@/types'

interface CodeBlockProps {
  code: string
  lang: CodeLang
  filename?: string
}

export async function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const html = await highlight(code, lang)

  return (
    <div className="relative rounded-xl overflow-hidden border border-hairline glass">
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface/40">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-ink-subtle font-mono ml-2">{filename}</span>
        </div>
      )}
      <div
        className="shiki [&_pre]:!bg-transparent [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
