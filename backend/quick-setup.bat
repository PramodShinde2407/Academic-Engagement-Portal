@echo off
echo ========================================
echo  Quick Database Setup
echo ========================================
echo.

REM Prompt for MySQL password
set /p MYSQL_PASS="Enter your MySQL root password: "

echo.
echo Step 1: Inserting roles...
mysql -u root -p%MYSQL_PASS% college_db < insert-roles.sql

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error inserting roles
    pause
    exit /b 1
)

echo ✅ Roles inserted successfully!
echo.
echo Step 2: Creating key tables...
mysql -u root -p%MYSQL_PASS% college_db < database\missing-tables.sql

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error creating tables
    pause
    exit /b 1
)

echo ✅ All tables created successfully!
echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Your database now has:
echo   ✓ 4 Roles: Student, Faculty, Admin, Club Head
echo   ✓ Key validation tables
echo.
echo Test registration keys:
echo   - Faculty: FACULTY_KEY_2024
echo   - Admin: ADMIN_KEY_2024
echo   - Club Head: TECH_CLUB_SECRET_2024
echo.
pause
