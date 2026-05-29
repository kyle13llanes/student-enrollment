@echo off
cd /d "%~dp0"
title Push to GitHub
color 0B
echo ============================================================
echo   Push project to GitHub (for permanent Render URL)
echo ============================================================
echo.
set /p GITHUB_USER="Enter your GitHub username: "
if "%GITHUB_USER%"=="" (
    echo ERROR: Username cannot be empty.
    pause
    exit /b 1
)
echo.
echo Using repo: https://github.com/%GITHUB_USER%/student-enrollment
echo.
echo BEFORE continuing, create an EMPTY repo on GitHub named:
echo   student-enrollment   (Public, NO README)
echo.
pause
echo.
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/student-enrollment.git
echo Pushing to GitHub...
git push -u origin main
if errorlevel 1 (
    color 0C
    echo.
    echo PUSH FAILED. Common fixes:
    echo   1. Create the repo on github.com first
    echo   2. Sign in when browser opens
    echo   3. See PERMANENT_LINK_STEPS.md Part 3.4 for token help
    pause
    exit /b 1
)
color 0A
echo.
echo SUCCESS! Code is on GitHub.
echo.
echo NEXT: Go to https://render.com
echo   New +  -^>  Blueprint  -^>  student-enrollment  -^>  Apply
echo.
echo Full steps: open PERMANENT_LINK_STEPS.md
echo.
pause
