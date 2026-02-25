import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="section-padding border-t border-white/10">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-lg gradient-text font-mono mb-3">Oxynet</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              AI-driven toolset for automatic interpretation of cardiopulmonary exercise test data.
            </p>
          </div>

          <div>
            <h4 className="text-white/80 font-semibold mb-3 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Python Package (PyPI)', href: 'https://pypi.org/project/pyoxynet/' },
                { label: 'Documentation', href: 'https://pyoxynet.readthedocs.io/en/latest/index.html' },
                { label: 'GitHub Repository', href: 'https://github.com/andreazignoli/pyoxynet' },
                { label: 'Web App', href: 'https://pyoxynet-lite-app-b415901c79ab.herokuapp.com/' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white/80 font-semibold mb-3 text-sm uppercase tracking-wider">
              Acknowledgments
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'TensorFlow / TFLite', href: 'https://www.tensorflow.org/lite/guide/inference' },
                { label: 'Keras', href: 'https://keras.io/' },
                { label: 'Amazon Lightsail', href: 'https://aws.amazon.com/getting-started/hands-on/serve-a-flask-app/' },
                { label: 'Flask', href: 'https://flask.palletsprojects.com/en/2.0.x/' },
                { label: 'Uniplot', href: 'https://github.com/olavolav/uniplot' },
                { label: 'Exercise Thresholds', href: 'https://www.exercisethresholds.com/' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="space-y-4">
          <div className="text-xs text-white/30 leading-relaxed max-w-3xl">
            <strong className="text-white/50">Disclaimer:</strong> All content on this website, including text,
            images, and other materials, is provided for informational purposes only. The information and
            software tools provided here are not substitutes for professional medical advice, diagnosis, or
            treatment. Always consult your physician or other qualified healthcare provider with any questions
            regarding a medical condition. Never disregard professional medical advice or delay seeking it
            based on information provided by this software.
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/30">
            <p>
              © {new Date().getFullYear()} Oxynet. Header photo by{' '}
              <a
                href="https://unsplash.com/@pawel_czerwinski"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/60 underline"
              >
                Pawel Czerwinski
              </a>{' '}
              on{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/60 underline"
              >
                Unsplash
              </a>
              .
            </p>
            <p className="text-white/20">
              Built with Next.js &amp; Vercel
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
