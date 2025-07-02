#!/bin/bash

echo "🚀 Starting Facebook Simulator Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Start the server
echo "🚀 Starting FastAPI server..."
echo "Backend will be available at:"
echo "  📡 API: http://localhost:8000"
echo "  📚 Docs: http://localhost:8000/docs"
echo ""
python main.py
