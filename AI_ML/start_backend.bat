@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ======================================
echo   TrainHyp AI Backend — FastAPI
echo   http://localhost:8000
echo   Docs: http://localhost:8000/docs
echo ======================================
echo.
echo Checking Python...
python --version
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.9+
    pause
    exit /b 1
)
echo.
echo Starting server...
python -m uvicorn main_fastapi:app --host 0.0.0.0 --port 8000 --reload
pause
