import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from '@/components/layout/navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Oxynet — Where AI meets CPET',
  description:
    'AI-driven toolset for the automatic interpretation of cardiopulmonary exercise test (CPET) data. Built with deep learning, Keras, and TensorFlow.',
  metadataBase: new URL('https://www.oxynet.net'),
  openGraph: {
    title: 'Oxynet — Where AI meets CPET',
    description:
      'AI-driven toolset for the automatic interpretation of cardiopulmonary exercise test (CPET) data.',
    url: 'https://www.oxynet.net',
    siteName: 'Oxynet',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oxynet — Where AI meets CPET',
    description:
      'AI-driven toolset for the automatic interpretation of cardiopulmonary exercise test (CPET) data.',
  },
  keywords: [
    'CPET',
    'cardiopulmonary exercise test',
    'AI',
    'deep learning',
    'pyoxynet',
    'VO2',
    'exercise physiology',
    'TensorFlow',
    'Keras',
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
