@echo off
echo ========================================
echo  Applying Database Fixes
echo ========================================
echo.

REM Prompt for MySQL password
set /p MYSQL_PASS="Enter your MySQL root password: "

echo.
echo Running missing-tables.sql...
mysql -u root -p%MYSQL_PASS% college_db < database\missing-tables.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database tables created successfully!
    echo.
    echo You can now test registration with these keys:
    echo   - Faculty: FACULTY_KEY_2024
    echo   - Admin: ADMIN_KEY_2024
    echo   - Club Head: TECH_CLUB_SECRET_2024
) else (
    echo.
    echo ❌ Error applying database changes
    echo Please check your MySQL password and try again
)

echo.
pause
