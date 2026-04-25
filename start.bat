@echo off
title TrainHyp AI Launcher

echo.
echo ==========================================
echo   TrainHyp AI - STAT3013 2026
echo ==========================================
echo.

:: Root = folder this bat lives in
set "ROOT=%~dp0"

:: --- Step 1: Python dependencies ---
echo [1/3] Installing Python dependencies...
pip install -r "%ROOT%AI_ML\requirements.txt"
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: pip failed, trying python -m pip...
    python -m pip install -r "%ROOT%AI_ML\requirements.txt"
)
echo.

:: --- Step 2: Node dependencies ---
echo [2/3] Checking Node dependencies...
if not exist "%ROOT%node_modules\" (
    echo Running npm install...
    call npm install
) else (
    echo node_modules present - skipping.
)
echo.

:: --- Step 3: Start Backend ---
echo [3/3] Launching services...
echo Backend  -^>  http://localhost:8000
echo API Docs -^>  http://localhost:8000/docs

:: /d sets the working directory WITHOUT nested quotes issue
start "TrainHyp Backend" /d "%ROOT%AI_ML" cmd /k "color 0A && echo. && echo  Backend ready: http://localhost:8000 && echo. && python -m uvicorn main_fastapi:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

:: --- Step 4: Start Frontend ---
echo Frontend -^>  http://localhost:5173

start "TrainHyp Frontend" /d "%ROOT%" cmd /k "color 0E && echo. && echo  Frontend ready: http://localhost:5173 && echo. && npm run dev"

echo.
echo ==========================================
echo   All services launched!
echo.
echo   Backend:   http://localhost:8000
echo   API Docs:  http://localhost:8000/docs
echo   Frontend:  http://localhost:5173
echo.
echo   Close this window when finished.
echo ==========================================
echo.
pause
