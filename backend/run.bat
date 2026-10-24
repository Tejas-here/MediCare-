@echo off
title MediCare+ Spring Boot Backend Server
echo ========================================================
echo        Starting MediCare+ Spring Boot Backend...
echo ========================================================
echo.
echo Database: MySQL (medicare_db on localhost:3306)
echo Server URL: http://localhost:8080/
echo.

:: Detect JAVA_HOME if not already set or invalid
if not defined JAVA_HOME (
    if exist "C:\Program Files\Java\jdk-27" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-27"
    ) else if exist "C:\Program Files\Java\latest" (
        set "JAVA_HOME=C:\Program Files\Java\latest"
    ) else if exist "C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot" (
        set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot"
    )
)
if defined JAVA_HOME (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

:: Locate Maven
set "MVN_CMD=mvn"
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Users\%USERNAME%\.maven\apache-maven-3.9.6\bin\mvn.cmd" (
        set "MVN_CMD=C:\Users\%USERNAME%\.maven\apache-maven-3.9.6\bin\mvn.cmd"
    ) else if exist "C:\Users\Admin\.maven\apache-maven-3.9.6\bin\mvn.cmd" (
        set "MVN_CMD=C:\Users\Admin\.maven\apache-maven-3.9.6\bin\mvn.cmd"
    ) else if exist "C:\Program Files\apache-maven\bin\mvn.cmd" (
        set "MVN_CMD=C:\Program Files\apache-maven\bin\mvn.cmd"
    ) else (
        echo [ERROR] Maven (mvn) was not found in your PATH or standard directories.
        echo Please install Maven or add it to your system PATH.
        echo Tip: You can install Maven quickly by running: winget install Apache.Maven
        echo.
        pause
        exit /b 1
    )
)

cd /d "%~dp0"
call %MVN_CMD% spring-boot:run

pause
