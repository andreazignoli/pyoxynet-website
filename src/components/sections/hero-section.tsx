'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/shared/gradient-text'

export function HeroSection() {
  return (
    <section
      // The hero always sits on a dark photograph, so it keeps the dark tokens
      // whatever the page theme is. Without this the light theme flipped every
      // ink token to near-black and put it on the picture: the subtitle, the
      // secondary button label and the stat figures all went dark on dark.
      data-theme="dark"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          quality={80}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        {/* A short scrim behind the fixed nav only. The photograph is at its
            brightest along the top edge, which is exactly where the wordmark
            and the nav links sit. */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,220,130,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Reading scrim. The photograph is not uniform: near-black on the left
            and a bright rust on the right, so one line of the paragraph held
            contrast and the next did not. This darkens only the centre, where
            the words are, and is fully transparent by 78%, so the picture is
            untouched at the edges where it is doing the work. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(58% 62% at 50% 54%, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0) 78%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6 pt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-accent text-xs font-mono uppercase tracking-[0.25em] mb-8"
        >
          A computational layer for CPET
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
          className="mb-4 leading-none"
        >
          {/* The wireframe duck, from the 3D Animals face. Do NOT swap this for
              DuckMark: that component draws /oxynet-icon.svg, which is the same
              path stroked until the mesh closes into a solid body so it survives
              a 16px favicon. At hero scale it reads as a blob. The wireframe is
              the logo; the solid is only for small sizes. */}
          <span className="font-3d-animals gradient-text text-[10rem] sm:text-[12rem] md:text-[14rem] select-none">
            E
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight mb-6 leading-none"
        >
          <GradientText>Oxynet</GradientText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl sm:text-2xl font-semibold text-ink-strong mb-4 leading-tight"
        >
          Physiological intelligence for exercise testing.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="text-base sm:text-lg text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Oxynet extracts physiological structure from cardiopulmonary exercise test signals and
          returns it as structured measurements: consistent across protocols, populations and
          devices, and available to people, clinical software and AI agents through the same API.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Button size="lg" asChild>
            <a href="https://app.oxynet.net">Open the Oxynet app →</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://app.oxynet.net/docs" target="_blank" rel="noopener noreferrer">
              Read the API docs
            </a>
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-4"
        >
          {[
            { value: '21', label: 'Metabolimeter formats read' },
            { value: 'REST, MCP, Python', label: 'Ways to call it' },
            { value: '12', label: 'Peer-reviewed papers' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-ink-strong">{stat.value}</div>
              <div className="text-xs text-ink-subtle uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-ink-faint text-sm"
      >
        ↓
      </motion.div>
    </section>
  )
}
