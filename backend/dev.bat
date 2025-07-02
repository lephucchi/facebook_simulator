@echo off
echo 🚀 Starting Facebook Simulator Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Start the server
echo 🚀 Starting FastAPI server...
echo Backend will be available at:
echo   📡 API: http://localhost:8000
echo   📚 Docs: http://localhost:8000/docs
echo.
python main.py

pause
