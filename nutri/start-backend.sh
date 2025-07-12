#!/bin/bash

echo "Starting Nutri Quantum Genie Backend Server..."
echo "=============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if required packages are installed
echo "Checking dependencies..."

# Check for Flask
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing Flask..."
    pip3 install flask flask-cors
fi

# Check for OpenAI
if ! python3 -c "import openai" 2>/dev/null; then
    echo "Installing OpenAI..."
    pip3 install openai
fi

# Check for guidance
if ! python3 -c "import guidance" 2>/dev/null; then
    echo "Installing guidance..."
    pip3 install guidance
fi

echo "Starting Flask server on http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the Flask server
python3 app.py 