
@echo off
setlocal

echo =======================================================
echo Setting up Java 21 and loading backend environment
echo =======================================================

set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo JAVA_HOME is now: %JAVA_HOME%
echo.

REM Check that the environment file exists
if not exist ".env" (
    echo ERROR: backend\.env file not found!
    echo Create the .env file with your local configuration.
    pause
    exit /b 1
)

REM Load environment variables from .env
for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
    if not "%%A"=="" set "%%A=%%B"
)

REM Check required variables without displaying their values
if not defined SPRING_DATASOURCE_URL (
    echo ERROR: SPRING_DATASOURCE_URL is missing from .env
    pause
    exit /b 1
)

if not defined SPRING_DATASOURCE_USERNAME (
    echo ERROR: SPRING_DATASOURCE_USERNAME is missing from .env
    pause
    exit /b 1
)

if not defined SPRING_DATASOURCE_PASSWORD (
    echo ERROR: SPRING_DATASOURCE_PASSWORD is missing from .env
    pause
    exit /b 1
)

if not defined JWT_SECRET (
    echo ERROR: JWT_SECRET is missing from .env
    pause
    exit /b 1
)

echo Environment variables loaded.
echo Starting Spring Boot backend...
echo.

call .\mvnw spring-boot:run

echo.
echo Backend process ended with exit code %ERRORLEVEL%.
pause
