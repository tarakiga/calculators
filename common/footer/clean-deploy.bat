@echo off
echo 🧹 Clean Footer Deployment
echo =========================
echo.
echo This script will completely clean and redeploy the footer system
echo with proper emoji encoding across ALL pages.
echo.
echo What it does:
echo - Removes ALL existing footer content
echo - Adds proper CSS/JS links
echo - Deploys footer with correct emoji encoding
echo - Fixes all pages at once
echo.
echo Options:
echo   1. DRY RUN (preview what will happen)
echo   2. CLEAN DEPLOY (fix everything with backups)
echo   3. Exit
echo.
set /p choice="Choose option (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🔍 Running clean deployment preview...
    powershell -ExecutionPolicy Bypass -File "clean-deploy.ps1" -DryRun
) else if "%choice%"=="2" (
    echo.
    echo 🧹 Running clean deployment with backups...
    powershell -ExecutionPolicy Bypass -File "clean-deploy.ps1" -Backup
) else if "%choice%"=="3" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

pause
