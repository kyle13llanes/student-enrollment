@echo off
cd /d "%~dp0"
echo ===================================================
echo  Connection Test
echo ===================================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Python not found. Install Python and add to PATH.
    goto end
)
echo [OK] Python is installed

echo.
echo Testing http://127.0.0.1:5000/api/ping ...
curl.exe -s -m 5 http://127.0.0.1:5000/api/ping >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Flask is NOT running or port 5000 is blocked.
    echo.
    echo Fix:
    echo   1. Double-click run.bat and leave that window OPEN
    echo   2. Then run this check again
    echo   3. In browser use: http://127.0.0.1:5000
    echo      Do NOT use: http://localhost/Attendancesystem
) else (
    echo [OK] Server is running! Response:
    curl.exe -s http://127.0.0.1:5000/api/ping
    echo.
    echo.
    echo Laptop URL:  http://127.0.0.1:5000
    for /f "delims=" %%i in ('python -c "import socket;s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM);s.connect(('8.8.8.8',80));print(s.getsockname()[0]);s.close()"') do set LAN=%%i
    echo Phone URL:    http://%LAN%:5000
)

:end
echo.
pause
