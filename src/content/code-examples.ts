import type { CodeExample } from '@/types'

export const CODE_EXAMPLES = {
  install_pip: {
    lang: 'sh',
    filename: 'terminal',
    code: 'pip install pyoxynet',
  },
  install_git: {
    lang: 'sh',
    filename: 'terminal',
    code: 'pip install git+https://github.com/andreazignoli/pyoxynet.git#subdirectory=pyoxynet',
  },
  basic_usage: {
    lang: 'python',
    filename: 'basic_usage.py',
    code: `import pyoxynet

# Load the TFL model
tfl_model = pyoxynet.load_tf_model()

# Make inference on a random input
test_tfl_model(tfl_model)

# Plot the inference on a test dataset
pyoxynet.test_pyoxynet()`,
  },
  generation: {
    lang: 'python',
    filename: 'generate_cpet.py',
    code: `from pyoxynet import *

# Call the generator
generator = load_tf_generator()

# Generate a Pandas DataFrame with fake CPET data
df = generate_CPET(generator, plot=True)

# Call Oxynet for inference on fake data
test_pyoxynet(input_df=df)`,
  },
} satisfies Record<string, CodeExample>
