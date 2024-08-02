---
layout: default
---

![Oxynet](https://andreazignoli.github.io/images/front_cover_blog_5.png)

**Oxynet is a powerful toolset for the automatic interpretation of cardiopulmonary exercise test (CPET) data.**

💻 [Try the web app](https://flask-service.ci6m7bo8luvmq.eu-central-1.cs.amazonlightsail.com/)

## About the Oxynet Project

Universal access to high-quality healthcare is a global challenge. Leveraging AI and vast data resources, *Oxynet* aims to revolutionize the diagnosis of medical conditions through CPET, facilitating accurate and timely clinical decisions while reducing costs associated with diagnostic errors and delays.

*Oxynet* combines:

- A network of CPET experts
- A large crowdsourced dataset
- AI algorithms approximating human cognition in CPET analysis

We seek collaboration with universities, hospitals, clinics, medical professionals, and companies involved in medical device development and commercialization. Together, we can advance R&D, support research financially, contribute to scientific publications, share data, develop web applications, conduct market analyses, and validate algorithms for clinical use.

## The *Pyoxynet* Package

*Pyoxynet* is a suite of deep neural network algorithms designed for CPET data analysis. Built with [Keras](https://keras.io/) and [TensorFlow](https://www.tensorflow.org/), the models are available in TFLite format for efficiency, with direct TensorFlow model usage from version 11.6 onward.

The package includes two main models:

- **Inference Model:** Estimates exercise intensity domains from CPET data.
- **Generator Model:** Creates synthetic CPET data.

🐍 [Install the Python package](https://pypi.org/project/pyoxynet/)  
📁 [Read the docs](https://pyoxynet.readthedocs.io/en/latest/index.html)

### Installation

*Pyoxynet* is compatible with **Python 3.8**. To install, run:

```sh
pip install pyoxynet
```

Or:

```sh
pip install git+https://github.com/andreazignoli/pyoxynet.git#subdirectory=pyoxynet
```

## Usage

To use the *inference* model, input CPET data including VO2, VCO2, VE, PetO2, PetCO2, VEVO2, and VEVCO2. *Pyoxynet* handles data interpolation, supporting sec-by-sec, breath-by-breath, and averaged data.

Example usage:

```python
import pyoxynet

# Load the TFL model
tfl_model = pyoxynet.load_tf_model()

# Make inference on a random input
test_tfl_model(tfl_model)

# Plot the inference on a test dataset
pyoxynet.test_pyoxynet()
```

## Generation

*Pyoxynet* includes a Conditional Generative Adversarial Network (CGAN) for generating realistic CPET data. Example:

```python
from pyoxynet import *

# Call the generator
generator = load_tf_generator()

# Generate a Pandas df with fake CPET data
df = generate_CPET(generator, plot=True)

# Call Oxynet for inference on fake data
test_pyoxynet(input_df=df)
```

Generated data includes VO2, VCO2, VE, HR, RF, PetO2, and PetCO2.

## Contacts

📧 Feedback & Issues: oxynetcpetinterpreter@gmail.com  
📧 PI: Andrea Zignoli: andrea.zignoli@unitn.it

## Publications

Explore the research behind *Oxynet*:

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

Special thanks to the following for their contributions:

- [TFLite Inference](https://www.tensorflow.org/lite/guide/inference)
- [Amazon Lightsail](https://aws.amazon.com/getting-started/hands-on/serve-a-flask-app/)
- [Flask](https://flask.palletsprojects.com/en/2.0.x/)
- [Uniplot Python library](https://github.com/olavolav/uniplot)
- [Machine Learning Mastery cGAN](https://machinelearningmastery.com/how-to-develop-a-conditional-generative-adversarial-network-from-scratch/)
- [Exercise Threshold](https://www.exercisethresholds.com/)
- Header photo by [Pawel Czerwinski](https://unsplash.com/@pawel_czerwinski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/data?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

## Disclaimer

All content found on this website, including text, images, tables, and other formats, is for informational purposes only. The information provided by this software is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of information provided by this software.
