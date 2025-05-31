@echo off
echo 🔧 Docket.One Footer Emoji Fix
echo =============================
echo.
echo This script will fix corrupted emojis in the footer system.
echo.
echo Options:
echo   1. DRY RUN (preview fixes without modifying files)
echo   2. FIX (apply emoji fixes to all pages)
echo   3. Exit
echo.
set /p choice="Choose option (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🔍 Running DRY RUN preview...
    powershell -ExecutionPolicy Bypass -File "fix-emojis.ps1" -DryRun
) else if "%choice%"=="2" (
    echo.
    echo 🔧 Fixing emoji encoding...
    powershell -ExecutionPolicy Bypass -File "fix-emojis.ps1"
) else if "%choice%"=="3" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

pause
