'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Tab {
  label: string
  filename: string
  html: string
}

interface UsageTabsProps {
  tabs: Tab[]
}

export function UsageTabs({ tabs }: UsageTabsProps) {
  return (
    <Tabs defaultValue={tabs[0]?.label}>
      <TabsList className="mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          <div className="relative rounded-xl overflow-hidden border border-hairline glass">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface/40">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-ink-subtle font-mono ml-2">{tab.filename}</span>
            </div>
            <div
              className="[&_pre]:!bg-transparent [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: tab.html }}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
