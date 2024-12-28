# Smart Farm Prediction

A comprehensive system for monitoring and predicting farm environmental conditions and crop growth using Deep Learning.

## Overview

Smart Farm Prediction combines environmental sensing with advanced machine learning to:
- Monitor farm weather conditions in real-time
- Predict future environmental conditions
- Forecast crop growth patterns
- Detect and predict pest issues
- Analyze internal and external environmental factors

## System Architecture

### Models
The system includes several specialized prediction models:

1. Environmental Models:
   - `internal_basic`: Predicts internal environment conditions
   - `internal_poc`: Proof of concept for internal predictions
   - `external_basic`: Basic external environment predictions
   - `external_wfs`: Weather forecast system integration
   - `internal_self`: Self-learning internal environment model

2. Growth Models:
   - `growth_basic`: Basic crop growth predictions
   - `growth_simple`: Simplified growth predictions
   - `pest_basic`: Pest detection and prediction

3. Data Processing:
   - AI Hub integration for environmental data
   - Pest observation processing
   - CSV and Excel file handling

## Prerequisites

* Python 3.8 or higher - [Download & install](https://www.python.org/downloads/)
* Poetry package manager - [Download & install](https://python-poetry.org)
* MySQL database
* GPU support for TensorFlow (recommended)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd smart-farm-prediction
```

2. Install dependencies using Poetry:
```bash
poetry install
```

3. Configure the database:
   - Create a MySQL database
   - Update database configuration in `config/common.conf`

## Configuration

The system uses a configuration file located at `config/common.conf`. Key configurations include:

- Database settings:
  - DB_TYPE
  - DB_HOST
  - DB_PORT
  - DB_USER
  - DB_PASSWORD
  - DB_DATABASE


## Running the System

1. Activate the Poetry shell:
```bash
poetry shell
```

2. Start the Shiny web interface:
```bash
shiny run --host 0.0.0.0 --port 8002 --reload app.py
```

3. Training models:
```bash
python main.py [model-id]
```

## Model Training

Model configurations are stored in `ai_models/train_options/[model-id].json`. Available models:

- Internal environment prediction
- External environment prediction
- Growth prediction
- Pest detection

Each model can be trained using specific datasets and parameters defined in their configuration files.

## Project Structure

```
├── models/                  # ML model implementations
│   ├── aihub/              # AI Hub integration
│   ├── pest/               # Pest detection models
│   ├── base_model.py       # Base model class
│   ├── model_factory.py    # Model creation factory
│   └── ...                 # Various model implementations
├── app.py                  # Shiny web interface
├── calc.py                 # Calculation utilities
├── config.py              # Configuration management
├── dbconn.py             # Database connectivity
├── logging_setup.py      # Logging configuration
├── main.py               # Main entry point
└── normalize.py          # Data normalization utilities
```

## Data Processing

The system handles multiple data types:
- Environmental sensor data (temperature, humidity, CO2)
- Weather forecast data
- Pest observation data
- Plant growth measurements

Data normalization and preprocessing are handled through the `normalize.py` module.

## Development

For development:
1. Create a new model by extending `BaseModel`
2. Add model configuration in `ai_models/train_options/`
3. Register the model in `model_factory.py`
4. Implement required methods:
   - `__init__`
   - `preprocess`
   - `train`
   - Optional: `test`, `predict`

## Acknowledgement

This work was supported by Institute of Information & communications Technology Planning & Evaluation (IITP) grant funded by the Korea government(MSIT) (No. 2021-0-00907, Development of Adaptive and Lightweight Edge-Collaborative Analysis Technology for Enabling Proactively Immediate Response and Rapid Learning).
