@echo off
cd /d "%~dp0"
title Student Enrollment - Flask Server
color 0A
echo ===================================================
echo  Student Enrollment System - Flask Server
echo ===================================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Python is not installed or not in PATH.
    echo Install from https://www.python.org/downloads/
    echo Check "Add python.exe to PATH" during install.
    pause
    exit /b 1
)

echo Installing dependencies...
python -m pip install -r requirements.txt -q
if errorlevel 1 (
    color 0C
    echo ERROR: Could not install Flask. Check your internet connection.
    pause
    exit /b 1
)

echo.
echo Checking if port 5000 is free...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
    echo WARNING: Port 5000 is already in use. Close other servers or set PORT=8080
)

echo.
echo Starting server...
echo IMPORTANT: Use http://127.0.0.1:5000  (NOT localhost/Attendancesystem in XAMPP)
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:5000"

python app.py
if errorlevel 1 (
    color 0C
    echo.
    echo Server stopped with an error. See message above.
)
echo.
pause
