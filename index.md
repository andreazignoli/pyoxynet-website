---
layout: default
---

![Oxynet](https://andreazignoli.github.io/images/front_cover_blog_5.png)

**Oxynet is a powerful AI-driven toolset for the automatic interpretation of cardiopulmonary exercise test (CPET) data.**

💻 [Try the web app](https://pyoxynet-lite-app-b415901c79ab.herokuapp.com/)

## About the Oxynet Project

Universal access to high-quality healthcare remains a global challenge. *Oxynet* leverages AI and vast data resources to revolutionize the diagnosis of medical conditions through CPET analysis, enabling accurate and timely clinical decisions while reducing costs associated with diagnostic errors and delays.

*Oxynet* combines three key components:

- A network of CPET experts providing clinical expertise
- A large crowdsourced dataset for comprehensive training
- Advanced AI algorithms that approximate human cognition in CPET analysis

We actively seek collaboration with universities, hospitals, clinics, medical professionals, and companies involved in medical device development and commercialization. Together, we can advance research and development, provide financial support for research initiatives, contribute to scientific publications, share valuable data, develop innovative web applications, conduct comprehensive market analyses, and validate algorithms for clinical implementation.

## The *Pyoxynet* Package

*Pyoxynet* is a comprehensive suite of deep neural network algorithms specifically designed for CPET data analysis. Built using [Keras](https://keras.io/) and [TensorFlow](https://www.tensorflow.org/), the models are available in efficient TFLite format, with direct TensorFlow model usage supported from version 11.6 onward.

The package includes two primary models:

- **Inference Model:** Estimates exercise intensity domains from CPET data with high accuracy
- **Generator Model:** Creates realistic synthetic CPET data for research and validation purposes

🐍 [Install the Python package](https://pypi.org/project/pyoxynet/)  
📁 [Read the docs](https://pyoxynet.readthedocs.io/en/latest/index.html)

### Installation

*Pyoxynet* requires **Python 3.8** or higher. To install the package, run:

```sh
pip install pyoxynet
```

Or:

```sh
pip install git+https://github.com/andreazignoli/pyoxynet.git#subdirectory=pyoxynet
```

## Usage

To use the inference model, provide CPET data including VO₂, VCO₂, VE, PetO₂, PetCO₂, VE/VO₂, and VE/VCO₂. *Pyoxynet* automatically handles data interpolation and supports multiple data formats: second-by-second, breath-by-breath, and averaged data.

### Basic Example

```python
import pyoxynet

# Load the TFL model
tfl_model = pyoxynet.load_tf_model()

# Make inference on a random input
test_tfl_model(tfl_model)

# Plot the inference on a test dataset
pyoxynet.test_pyoxynet()
```

## Data Generation

*Pyoxynet* includes a Conditional Generative Adversarial Network (CGAN) capable of generating realistic CPET data for research and testing purposes.

### Generation Example

```python
from pyoxynet import *

# Call the generator
generator = load_tf_generator()

# Generate a Pandas df with fake CPET data
df = generate_CPET(generator, plot=True)

# Call Oxynet for inference on fake data
test_pyoxynet(input_df=df)
```

The generated synthetic data includes all essential CPET parameters: VO₂, VCO₂, VE, HR, RF, PetO₂, and PetCO₂.

## Contact Information

📧 **Feedback & Issues:** oxynetcpetinterpreter@gmail.com  
📧 **Principal Investigator:** Andrea Zignoli (andrea.zignoli@unitn.it)

## Scientific Publications

Explore the peer-reviewed research and publications behind *Oxynet*:

- [Research](https://www.sciencedirect.com/science/article/abs/pii/S1746809423002690): AI for CPET interpretation
- [Review](https://link.springer.com/article/10.1007%2Fs11332-019-00557-x): AI technologies in exercise data processing
- [Research](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0229466): LSTM networks for VO2 estimation
- [Research](https://www.tandfonline.com/doi/abs/10.1080/17461391.2019.1587523?journalCode=tejs20): LSTM for intensity domain estimation
- [Research](https://www.tandfonline.com/doi/abs/10.1080/17461391.2020.1866081?journalCode=tejs20): Crowdsourcing and CNN for intensity domain determination
- [Research](https://www.overleaf.com/read/fcmwscvyhtfq): Conditional GANs for synthetic CPET data
- [Research](https://www.mdpi.com/1424-8220/23/2/826): Regression, generation, and explanation
- [LinkedIn](https://www.linkedin.com/pulse/oxynet-collective-intelligence-approach-test-andrea-zignoli/): Oxynet project overview
- [Blog](https://andreazignoli.github.io/blog-post-5/): AI in CPET data interpretation
- [Medium](https://medium.com/@andrea.zignoli/automatic-interpretation-of-cardiopulmonary-exercise-tests-with-deep-learning-2c9b3920ad51): Using the Python package for CPET inference
- [Medium](https://medium.com/@andrea.zignoli/automatic-generation-of-cardiopulmonary-exercise-tests-with-deep-learning-d1f2cab4e765): Generating realistic CPET data with Python

## Acknowledgments

We extend our gratitude to the following resources and contributors:

- [TFLite Inference](https://www.tensorflow.org/lite/guide/inference)
- [Amazon Lightsail](https://aws.amazon.com/getting-started/hands-on/serve-a-flask-app/)
- [Flask](https://flask.palletsprojects.com/en/2.0.x/)
- [Uniplot Python library](https://github.com/olavolav/uniplot)
- [Machine Learning Mastery cGAN](https://machinelearningmastery.com/how-to-develop-a-conditional-generative-adversarial-network-from-scratch/)
- [Exercise Threshold](https://www.exercisethresholds.com/)
- Header photo by [Pawel Czerwinski](https://unsplash.com/@pawel_czerwinski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/data?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

## Disclaimer

All content on this website, including text, images, tables, and other materials, is provided for informational purposes only. The information and software tools provided here are not substitutes for professional medical advice, diagnosis, or treatment. Always consult your physician or other qualified healthcare provider with any questions regarding a medical condition. Never disregard professional medical advice or delay seeking it based on information provided by this software.
