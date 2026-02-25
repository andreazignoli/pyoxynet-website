import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { PackageSection } from '@/components/sections/package-section'
import { UsageSection } from '@/components/sections/usage-section'
import { PublicationsSection } from '@/components/sections/publications-section'
import { ContactSection } from '@/components/sections/contact-section'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <PackageSection />
      <UsageSection />
      <PublicationsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
