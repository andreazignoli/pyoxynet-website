import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from '@/components/layout/navbar'
import './globals.css'

const TITLE = 'Oxynet: physiological intelligence for CPET'
const DESCRIPTION =
  'A computational layer for cardiopulmonary exercise testing. Oxynet turns CPET ' +
  'signals into structured physiological measurements: ventilatory thresholds, ' +
  'intensity domains, oscillation analysis and signal integrity, over an API that ' +
  'clinical systems, research pipelines and AI agents can call directly.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL('https://www.oxynet.net'),
  icons: { icon: '/oxynet-icon.svg' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.oxynet.net',
    siteName: 'Oxynet',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  keywords: [
    'CPET',
    'cardiopulmonary exercise test',
    'CPET interpretation',
    'ventilatory thresholds',
    'VT1',
    'VT2',
    'exercise oscillatory ventilation',
    'CPET API',
    'exercise physiology',
    'VO2',
    'pyoxynet',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
