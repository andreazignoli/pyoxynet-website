'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/shared/gradient-text'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,220,130,0.08) 0%, transparent 70%)',
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
          AI-powered CPET interpretation
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
          className="mb-4 leading-none"
        >
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
          className="text-xl sm:text-2xl font-semibold text-white/85 mb-4 leading-tight"
        >
          Consistent, scalable, system-agnostic.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="text-base sm:text-lg text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Oxynet provides a data-driven interpretation layer for cardiopulmonary exercise testing (CPET),
          enabling consistent detection of thresholds and key markers across protocols, populations, and devices.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Button size="lg" asChild>
            <a
              href="https://www.exercisethresholds.com/oxynet"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try Oxynet on Exercise Thresholds
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#contact">Request API access</a>
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
            { value: '12+', label: 'Publications' },
            { value: 'API + Web + Python', label: 'Deployment options' },
            { value: 'Open Source', label: 'on GitHub' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-white/90">{stat.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/25 text-sm"
      >
        ↓
      </motion.div>
    </section>
  )
}
