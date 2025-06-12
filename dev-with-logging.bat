@echo off
cd /d "%~dp0"
echo Starting Next.js development server...
echo.
echo Server output will be logged to: dev-server.log
echo.
node node_modules\next\dist\bin\next dev -H 0.0.0.0 2>&1 | tee dev-server.log