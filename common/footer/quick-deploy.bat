@echo off
echo 🧮 Docket.One Footer Deployment - Quick Start
echo ==========================================
echo.
echo This script will automatically add the premium footer to all calculator pages.
echo.
echo Options:
echo   1. DRY RUN (preview changes without modifying files)
echo   2. DEPLOY (apply changes with automatic backups)
echo   3. DEPLOY (apply changes without backups)
echo   4. Exit
echo.
set /p choice="Choose option (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🔍 Running DRY RUN preview...
    powershell -ExecutionPolicy Bypass -File "deploy-footer.ps1" -DryRun
) else if "%choice%"=="2" (
    echo.
    echo 🚀 Deploying footer with backups...
    powershell -ExecutionPolicy Bypass -File "deploy-footer.ps1" -Backup
) else if "%choice%"=="3" (
    echo.
    echo ⚡ Deploying footer without backups...
    powershell -ExecutionPolicy Bypass -File "deploy-footer.ps1"
) else if "%choice%"=="4" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

pause
