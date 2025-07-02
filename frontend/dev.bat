@echo off
echo 🚀 Starting Facebook Simulator Frontend...

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    npm install
)

REM Start the development server
echo 🚀 Starting React development server...
echo Frontend will be available at:
echo   📱 App: http://localhost:5173
echo.
npm run dev

pause
