import { HeroSection } from '@/components/sections/hero-section'
import { DemoSection } from '@/components/sections/demo-section'
import { AboutSection } from '@/components/sections/about-section'
import { MeasurementSection } from '@/components/sections/measurement-section'
import { OutputsSection } from '@/components/sections/outputs-section'
import { AgentsSection } from '@/components/sections/agents-section'
import { AudienceSection } from '@/components/sections/audience-section'
import { HowItWorksSection } from '@/components/sections/how-it-works-section'
import { DeploymentSection } from '@/components/sections/deployment-section'
import { ValidationSection } from '@/components/sections/validation-section'
import { PackageSection } from '@/components/sections/package-section'
import { UsageSection } from '@/components/sections/usage-section'
import { PublicationsSection } from '@/components/sections/publications-section'
import { ContactSection } from '@/components/sections/contact-section'
import { Footer } from '@/components/layout/footer'
import { SectionRail } from '@/components/layout/section-rail'

export default function HomePage() {
  return (
    <main>
      <SectionRail />
      <HeroSection />
      <DemoSection />
      <AboutSection />
      <MeasurementSection />
      <OutputsSection />
      <AgentsSection />
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
