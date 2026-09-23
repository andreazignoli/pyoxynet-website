import { highlight } from '@/lib/shiki'
import type { CodeLang } from '@/types'
import { CopyButton } from '@/components/shared/copy-button'

interface CodeBlockProps {
  code: string
  lang: CodeLang
  filename?: string
  /** Show a copy button. The developer pages turn it on; the landing page keeps its look. */
  copy?: boolean
  /** A link to the same file as a download, shown in the header. */
  download?: string
}

export async function CodeBlock({ code, lang, filename, copy = false, download }: CodeBlockProps) {
  const html = await highlight(code, lang)
  const header = filename || copy || download

  return (
    <div className="relative rounded-xl overflow-hidden border border-hairline glass">
      {header && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface/40">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          {filename && <span className="text-xs text-ink-subtle font-mono ml-2 truncate">{filename}</span>}
          <div className="ml-auto flex items-center gap-2">
            {download && (
              <a
                href={download}
                download
                className="text-[11px] font-mono text-ink-subtle hover:text-accent transition-colors px-2 py-0.5 rounded border border-hairline hover:border-accent/40"
              >
                Download
              </a>
            )}
            {copy && <CopyButton text={code} />}
          </div>
        </div>
      )}
      <div
        className="shiki [&_pre]:!bg-transparent [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
