@echo off
echo 🧹 SIMPLE Footer Cleanup
echo ========================
echo.
echo This script uses a simple approach to clean all footer content
echo and redeploy with proper encoding - no complex regex patterns.
echo.
echo What it does:
echo - Finds where footer content starts
echo - Removes everything from that point to end
echo - Adds completely clean footer
echo - Uses simple line-by-line processing
echo.
echo Options:
echo   1. DRY RUN (see what will be cleaned)
echo   2. SIMPLE CLEANUP (clean and redeploy)
echo   3. Exit
echo.
set /p choice="Choose option (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🔍 Running simple cleanup preview...
    powershell -ExecutionPolicy Bypass -File "simple-cleanup.ps1" -DryRun
) else if "%choice%"=="2" (
    echo.
    echo 🧹 Running simple cleanup with backups...
    powershell -ExecutionPolicy Bypass -File "simple-cleanup.ps1" -Backup
) else if "%choice%"=="3" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

pause
