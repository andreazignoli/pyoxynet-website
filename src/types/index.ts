export type PublicationType = 'research' | 'review' | 'blog' | 'linkedin' | 'medium'

export interface Publication {
  type: PublicationType
  title: string
  description: string
  url: string
  year?: number
  journal?: string
}

export type CodeLang = 'python' | 'sh' | 'bash'

export interface CodeExample {
  lang: CodeLang
  filename: string
  code: string
}

export interface NavItem {
  label: string
  href: string
  external?: boolean
}
