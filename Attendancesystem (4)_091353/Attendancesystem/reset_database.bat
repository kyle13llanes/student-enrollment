@echo off
cd /d "%~dp0"
echo This deletes the local database and recreates sample data on next server start.
if exist "data\enrollment.db" del "data\enrollment.db"
echo Done. Run run.bat to start with fresh sample students.
pause
