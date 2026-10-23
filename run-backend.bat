@echo off
title MediCare+ Spring Boot Backend Server
echo ========================================================
echo        Starting MediCare+ Spring Boot Backend...
echo ========================================================
echo.
echo Database: MySQL (medicare_db on localhost:3306)
echo Server URL: http://localhost:8080/
echo.

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot
set PATH=%JAVA_HOME%\bin;C:\Users\Admin\.maven\apache-maven-3.9.6\bin;%PATH%

cd /d "%~dp0backend"
call "C:\Users\Admin\.maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run

pause
