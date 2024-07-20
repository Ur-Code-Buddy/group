#!/bin/bash

# Install Python and pip if not already installed
if ! command -v python3 &> /dev/null
then
    echo "Python3 could not be found, installing..."
    sudo apt-get update
    sudo apt-get install -y python3 python3-pip
fi

# Install Python dependencies
pip3 install -r ./scripts/requirements.txt

# Install Node.js dependencies
npm install

# Run the Node.js application
node dist/index.js
