@echo off
title MediCare Hub - Live Server
color 0B
echo ========================================================
echo         MediCare Hub - Automated Server Launcher
echo ========================================================
echo.
echo Starting MediCare Hub Frontend Server...
cd /d "%~dp0frontend"

echo.
echo Launching browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo Server is running! Do not close this window while using the website.
echo.
call npm.cmd run dev
pause
