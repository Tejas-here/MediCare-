@echo off
title MediCare+ Platform Server (REST API + Database)
echo ========================================================
echo        Starting MediCare+ Platform Backend Server...
echo ========================================================
echo.
echo Database: JSON + Relational SQL Schemas (medicare_data.json)
echo Port: 8080
echo.
echo URLs:
echo   - Patient Portal:   http://localhost:8080/dashboard.html
echo   - Doctor Dashboard: http://localhost:8080/doctor-dashboard.html
echo   - Admin Dashboard:  http://localhost:8080/admin-dashboard.html
echo   - REST API Base:    http://localhost:8080/api/
echo ========================================================
echo.

node "%~dp0server.js"

pause
