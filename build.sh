#!/bin/bash

# Check what Python version is available
python --version
pip --version

# Install Python dependencies from requirements.txt
pip install -r requirements.txt

# Make Python script executable (optional)
chmod +x removeBg.py

echo "Python dependencies installed successfully"