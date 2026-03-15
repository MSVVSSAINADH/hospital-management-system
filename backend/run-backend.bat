@echo off
echo =======================================================
echo Setting JAVA_HOME to JDK 21 and starting the Backend
echo =======================================================

set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME is now: %JAVA_HOME%
echo.

call .\mvnw clean spring-boot:run
pause
