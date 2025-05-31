@echo off
echo 🧽 THOROUGH Footer Cleanup
echo ==========================
echo.
echo This script will aggressively remove ALL footer remnants
echo and deploy a completely clean footer system.
echo.
echo What it does:
echo - Removes ALL old footer fragments (even hidden ones)
echo - Cleans up corrupted emoji remnants  
echo - Removes orphaned HTML tags
echo - Deploys completely fresh footer
echo - Creates thorough backups
echo.
echo Options:
echo   1. DRY RUN (see what will be cleaned)
echo   2. THOROUGH CLEANUP (remove everything and start fresh)
echo   3. Exit
echo.
set /p choice="Choose option (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🔍 Running thorough cleanup preview...
    powershell -ExecutionPolicy Bypass -File "thorough-cleanup.ps1" -DryRun
) else if "%choice%"=="2" (
    echo.
    echo 🧽 Running thorough cleanup with backups...
    powershell -ExecutionPolicy Bypass -File "thorough-cleanup.ps1" -Backup
) else if "%choice%"=="3" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

pause
