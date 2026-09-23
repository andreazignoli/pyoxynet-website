/** The developer hub's table of contents. One list feeds the sidebar, the mobile menu and the sitemap. */

export interface DevNavItem {
  href: string
  label: string
}

export const DEV_NAV: { group: string; items: DevNavItem[] }[] = [
  {
    group: 'Start',
    items: [
      { href: '/developers', label: 'Overview' },
      { href: '/developers/quickstart', label: 'Quick start' },
      { href: '/developers/downloads', label: 'Downloads' },
    ],
  },
  {
    group: 'Interfaces',
    items: [
      { href: '/developers/api/v1', label: 'REST API (v1)' },
      { href: '/developers/python', label: 'Python' },
      { href: '/developers/mcp', label: 'MCP and AI agents' },
    ],
  },
  {
    group: 'Reference',
    items: [
      { href: '/developers/formats', label: 'Supported formats' },
      { href: '/developers/analyses', label: 'Analysis catalogue' },
      { href: '/developers/outputs', label: 'Outputs and provenance' },
      { href: '/developers/data-handling', label: 'Data handling' },
    ],
  },
  {
    group: 'Partners',
    items: [
      { href: '/developers/patterns', label: 'Integration patterns' },
      { href: '/developers/partners', label: 'Partner onboarding' },
    ],
  },
]

export const DEV_PAGES = DEV_NAV.flatMap((g) => g.items)
