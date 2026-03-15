@echo off
echo ========================================================
echo   PULLING LATEST CODE FROM GITHUB & DEPLOYING...
echo ========================================================

REM 1. Stop the current containers
echo [1/3] Stopping old containers...
docker-compose down

REM 2. Rebuild with NO CACHE (This forces a fresh Git Clone)
echo [2/3] Downloading fresh code from GitHub and building...
docker-compose build --no-cache

REM 3. Start the app
echo [3/3] Starting the application...
docker-compose up

pause