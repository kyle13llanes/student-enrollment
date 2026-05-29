@echo off
cd /d "%~dp0"
title Get Public Website URL
color 0B
echo ============================================================
echo   Student Enrollment - PUBLIC URL (temporary, free)
echo ============================================================
echo.
echo Step 1: Starting Flask server in a new window...
start "Flask Server" cmd /k "cd /d "%~dp0" && python -m pip install -r requirements.txt -q && python app.py"
echo Waiting 8 seconds for server to start...
timeout /t 8 /nobreak >nul
echo.
echo Step 2: Creating public link (anyone on the internet can open it)...
echo.
echo YOUR PUBLIC URL will appear below in a few seconds.
echo Copy the https://....loca.lt link for your report/demo.
echo.
echo Login: demo / demo123
echo.
echo Keep BOTH windows open while the site is public.
echo Press Ctrl+C in this window to stop the public tunnel.
echo ============================================================
echo.
set BEHIND_PROXY=1
npx --yes localtunnel --port 5000
pause
