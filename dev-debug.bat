@echo off
cd /d "%~dp0"
echo === Starting Next.js Dev Server ===
echo Time: %date% %time%
echo Port: 3000
echo.
set NODE_ENV=development
node node_modules\next\dist\bin\next dev -H 0.0.0.0
pause