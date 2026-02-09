@echo off
echo ========================================
echo  Complete Database Setup
echo ========================================
echo.
echo This will:
echo   1. Create college_db database
echo   2. Create all tables
echo   3. Insert roles and test keys
echo.

REM Prompt for MySQL password
set /p MYSQL_PASS="Enter your MySQL root password: "

echo.
echo Running complete setup...
mysql -u root -p%MYSQL_PASS% < database\complete-setup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  ✅ Database Setup Complete!
    echo ========================================
    echo.
    echo Your database is ready with:
    echo   ✓ Database: college_db
    echo   ✓ All tables created
    echo   ✓ 4 Roles: Student, Faculty, Admin, Club Head
    echo.
    echo Test registration keys:
    echo   - Faculty: FACULTY_KEY_2024
    echo   - Admin: ADMIN_KEY_2024
    echo   - Club Head: TECH_CLUB_SECRET_2024
    echo.
    echo Next step: Refresh your registration page!
) else (
    echo.
    echo ❌ Error setting up database
    echo Please check:
    echo   1. MySQL is running
    echo   2. Password is correct
    echo   3. You have permissions to create databases
)

echo.
pause
