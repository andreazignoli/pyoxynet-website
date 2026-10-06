import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { DoorsSection } from '@/components/sections/doors-section'
import { OutputsSection } from '@/components/sections/outputs-section'
import { ValidationSection } from '@/components/sections/validation-section'
import { CustomModelsSection } from '@/components/sections/custom-models-section'
import { PackageSection } from '@/components/sections/package-section'
import { PublicationsSection } from '@/components/sections/publications-section'
import { ContactSection } from '@/components/sections/contact-section'
import { Footer } from '@/components/layout/footer'
import { SectionRail } from '@/components/layout/section-rail'

/**
 * The order is the argument a first-time visitor needs, one step at a time:
 * what Oxynet is, why it matters and what it does (about, with the slider),
 * how to reach it (the three doors), what comes back (outputs), why to believe
 * it (validation), how to make it yours (a model for your lab), the open
 * research side (package), the record (publications), and who to write to.
 */
export default function HomePage() {
  return (
    <main>
      <SectionRail />
      <HeroSection />
      <AboutSection />
      <DoorsSection />
      <OutputsSection />
      <ValidationSection />
      <CustomModelsSection />
      <PackageSection />
      <PublicationsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
