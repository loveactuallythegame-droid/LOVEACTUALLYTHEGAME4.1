@echo off
echo 🔧 Quick Fix for Love Actually... The Game Dependencies
echo.

echo 1. Removing problematic dependencies...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo 2. Installing with compatibility flags...
call npm install --legacy-peer-deps

if %errorlevel% equ 0 (
    echo.
    echo ✅ Installation completed successfully!
    echo.
    echo Next steps:
    echo - Run: npm run dev
    echo - Open http://localhost:3000
    echo - Test Dr. Marcie's voice with Murf AI!
) else (
    echo.
    echo ❌ Installation failed. Trying alternative...
    call npm install --force
    echo.
    if %errorlevel% equ 0 (
        echo ✅ Force installation completed!
    ) else (
        echo ❌ Still having issues. Please check:
        echo - Node.js version (should be 18+)
        echo - npm version (should be 9+)
        echo - Try running: npm install --legacy-peer-deps manually
    )
)

pause