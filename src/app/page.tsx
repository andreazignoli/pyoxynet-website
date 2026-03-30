import { HeroSection } from '@/components/sections/hero-section'
import { DemoSection } from '@/components/sections/demo-section'
import { AboutSection } from '@/components/sections/about-section'
import { OutputsSection } from '@/components/sections/outputs-section'
import { AudienceSection } from '@/components/sections/audience-section'
import { HowItWorksSection } from '@/components/sections/how-it-works-section'
import { DeploymentSection } from '@/components/sections/deployment-section'
import { ValidationSection } from '@/components/sections/validation-section'
import { PackageSection } from '@/components/sections/package-section'
import { UsageSection } from '@/components/sections/usage-section'
import { PublicationsSection } from '@/components/sections/publications-section'
import { ContactSection } from '@/components/sections/contact-section'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <DemoSection />
      <AboutSection />
      <OutputsSection />
      <AudienceSection />
      <HowItWorksSection />
      <DeploymentSection />
      <ValidationSection />
      <PackageSection />
      <UsageSection />
      <PublicationsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
