@echo off
echo Setting up new role keys...
echo.

mysql -u root -ppict@123 college_db < database\add-new-role-keys.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ New role keys setup complete!
    echo.
    echo Test keys created:
    echo - Club Mentor: CLUB_MENTOR_KEY_2024
    echo - Estate Manager: ESTATE_MANAGER_KEY_2024
    echo - Principal: PRINCIPAL_KEY_2024
    echo - Director: DIRECTOR_KEY_2024
    echo.
) else (
    echo.
    echo ❌ Setup failed! Check MySQL connection.
    echo.
)

pause
