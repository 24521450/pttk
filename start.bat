@echo off
chcp 65001 >nul
title TrainHyp AI — Launcher
color 0B

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║       🏋️  TrainHyp AI — Launcher         ║
echo  ║       STAT3013 · 2026                    ║
echo  ╚══════════════════════════════════════════╝
echo.

:: ─── Detect project root (where this .bat lives) ────────────────────────────
set "ROOT=%~dp0"
cd /d "%ROOT%"

:: ─── Step 1: Install Python dependencies ────────────────────────────────────
echo [1/3] Installing Python dependencies...
echo.
pip install -r "%ROOT%AI_ML\requirements.txt" --quiet 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo  ⚠  pip install failed — trying with python -m pip...
    python -m pip install -r "%ROOT%AI_ML\requirements.txt" --quiet 2>nul
)
echo  ✅  Python dependencies ready.
echo.

:: ─── Step 2: Install Node dependencies (first time) ────────────────────────
echo [2/3] Checking Node dependencies...
if not exist "%ROOT%node_modules" (
    echo  📦  node_modules not found — running npm install...
    call npm install --silent
    echo  ✅  Node dependencies installed.
) else (
    echo  ✅  node_modules already exists — skipping.
)
echo.

:: ─── Step 3: Start Backend (new window) ─────────────────────────────────────
echo [3/3] Starting services...
echo.
echo  🔧  Starting Backend  →  http://localhost:8000
echo  🔧  API Docs           →  http://localhost:8000/docs

start "TrainHyp Backend" cmd /k "cd /d "%ROOT%AI_ML" && title TrainHyp Backend (port 8000) && color 0A && echo. && echo  🟢 Backend starting... && echo. && uvicorn main_fastapi:app --host 0.0.0.0 --port 8000 --reload"

:: Wait 3 seconds for backend to initialize before starting frontend
timeout /t 3 /nobreak >nul

:: ─── Step 4: Start Frontend (new window) ────────────────────────────────────
echo  🌐  Starting Frontend  →  http://localhost:5173
echo.

start "TrainHyp Frontend" cmd /k "cd /d "%ROOT%" && title TrainHyp Frontend (port 5173) && color 0E && echo. && echo  🟢 Frontend starting... && echo. && npm run dev"

:: ─── Done ───────────────────────────────────────────────────────────────────
timeout /t 2 /nobreak >nul
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║  ✅  All services launched!               ║
echo  ║                                          ║
echo  ║  Backend:   http://localhost:8000         ║
echo  ║  API Docs:  http://localhost:8000/docs    ║
echo  ║  Frontend:  http://localhost:5173         ║
echo  ║                                          ║
echo  ║  Close this window to keep running.      ║
echo  ║  Close ALL windows to stop everything.   ║
echo  ╚══════════════════════════════════════════╝
echo.
pause
