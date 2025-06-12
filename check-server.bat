@echo off
echo Checking server status...
echo.
echo === Port 3000 Status ===
netstat -an | findstr :3000
echo.
echo === Node.js Processes ===
tasklist | findstr node
echo.
echo === Recent Server Logs ===
if exist dev-server.log (
    type dev-server.log | more
) else (
    echo No log file found yet.
)
pause