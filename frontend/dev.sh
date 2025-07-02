#!/bin/bash

echo "🚀 Starting Facebook Simulator Frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Start the development server
echo "🚀 Starting React development server..."
echo "Frontend will be available at:"
echo "  📱 App: http://localhost:5173"
echo ""
npm run dev
