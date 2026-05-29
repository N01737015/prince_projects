@echo off
echo ============================================
echo   Maple Electronics - Seeding Database
echo ============================================
echo.
echo This will insert 12 sample products across 6 categories.
echo Make sure the application is already running (start.bat).
echo.
docker-compose exec backend node src/scripts/seed.js
echo.
echo Done! Visit http://localhost:3000 to see products.
pause
