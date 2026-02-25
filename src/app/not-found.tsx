import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/shared/gradient-text'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p className="text-accent text-xs font-mono uppercase tracking-[0.25em] mb-6">404 Error</p>
        <h1 className="text-6xl sm:text-7xl font-bold mb-4">
          <GradientText>Page Not Found</GradientText>
        </h1>
        <p className="text-white/55 text-lg mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button size="lg" asChild>
          <a href="/">Go Home</a>
        </Button>
      </div>
    </div>
  )
}
