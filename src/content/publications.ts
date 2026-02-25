import type { Publication } from '@/types'

export const PUBLICATIONS: Publication[] = [
  {
    type: 'research',
    title: 'AI for CPET Interpretation',
    description:
      'Deep learning approach for automatic interpretation of cardiopulmonary exercise test data using neural networks.',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S1746809423002690',
    year: 2023,
    journal: 'Biomedical Signal Processing and Control',
  },
  {
    type: 'review',
    title: 'AI Technologies in Exercise Data Processing',
    description:
      'Comprehensive review of machine learning and AI techniques applied to exercise physiology data analysis.',
    url: 'https://link.springer.com/article/10.1007%2Fs11332-019-00557-x',
    year: 2019,
    journal: 'Sport Sciences for Health',
  },
  {
    type: 'research',
    title: 'LSTM Networks for VO₂ Estimation',
    description:
      'Application of long short-term memory recurrent neural networks for estimating oxygen uptake during exercise.',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0229466',
    year: 2020,
    journal: 'PLOS ONE',
  },
  {
    type: 'research',
    title: 'LSTM for Intensity Domain Estimation',
    description:
      'Using LSTM neural networks for automatic detection of exercise intensity domains in CPET data.',
    url: 'https://www.tandfonline.com/doi/abs/10.1080/17461391.2019.1587523?journalCode=tejs20',
    year: 2019,
    journal: 'European Journal of Sport Science',
  },
  {
    type: 'research',
    title: 'Crowdsourcing and CNN for Intensity Domain Determination',
    description:
      'Combining crowdsourced expert labels with convolutional neural networks for CPET intensity domain classification.',
    url: 'https://www.tandfonline.com/doi/abs/10.1080/17461391.2020.1866081?journalCode=tejs20',
    year: 2021,
    journal: 'European Journal of Sport Science',
  },
  {
    type: 'research',
    title: 'Conditional GANs for Synthetic CPET Data',
    description:
      'Generating realistic synthetic cardiopulmonary exercise test data using conditional generative adversarial networks.',
    url: 'https://www.overleaf.com/read/fcmwscvyhtfq',
    journal: 'Preprint',
  },
  {
    type: 'research',
    title: 'Regression, Generation, and Explanation',
    description:
      'Multi-task deep learning framework combining regression, data generation, and explainability for CPET analysis.',
    url: 'https://www.mdpi.com/1424-8220/23/2/826',
    year: 2023,
    journal: 'Sensors (MDPI)',
  },
  {
    type: 'linkedin',
    title: 'Oxynet: A Collective Intelligence Approach',
    description:
      'Overview of the Oxynet project: how collective intelligence and AI are transforming CPET interpretation.',
    url: 'https://www.linkedin.com/pulse/oxynet-collective-intelligence-approach-test-andrea-zignoli/',
  },
  {
    type: 'blog',
    title: 'AI in CPET Data Interpretation',
    description:
      'A deep dive into how AI can be used to automatically interpret cardiopulmonary exercise test data.',
    url: 'https://andreazignoli.github.io/blog-post-5/',
  },
  {
    type: 'medium',
    title: 'Automatic Interpretation of CPET with Deep Learning',
    description:
      'Step-by-step guide to using the Pyoxynet Python package for automatic CPET inference with deep learning.',
    url: 'https://medium.com/@andrea.zignoli/automatic-interpretation-of-cardiopulmonary-exercise-tests-with-deep-learning-2c9b3920ad51',
  },
  {
    type: 'medium',
    title: 'Generating Realistic CPET Data with Python',
    description:
      'How to use the Pyoxynet CGAN model to generate synthetic but realistic cardiopulmonary exercise test datasets.',
    url: 'https://medium.com/@andrea.zignoli/automatic-generation-of-cardiopulmonary-exercise-tests-with-deep-learning-d1f2cab4e765',
  },
]
