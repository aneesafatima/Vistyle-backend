#!/bin/bash

# Print Python and pip versions (optional)
python --version
pip --version

# Install required system libraries
apt-get update
apt-get install -y libstdc++6 libgomp1

# Install Python packages
pip install -r requirements.txt

# Make your script executable (optional)
chmod +x removeBg.py

echo "✅ All dependencies installed successfully"
