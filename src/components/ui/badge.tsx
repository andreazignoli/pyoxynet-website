import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-accent/40 bg-accent/20 text-accent',
        secondary: 'border-white/20 bg-white/10 text-white/70',
        outline: 'border-white/20 text-white/70',
        research: 'border-accent/30 bg-accent/20 text-accent',
        review: 'border-blue-500/30 bg-blue-500/20 text-blue-400',
        blog: 'border-purple-500/30 bg-purple-500/20 text-purple-400',
        medium: 'border-orange-500/30 bg-orange-500/20 text-orange-400',
        linkedin: 'border-sky-500/30 bg-sky-500/20 text-sky-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
