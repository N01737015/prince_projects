@echo off
echo ============================================================
echo   Maple Electronics - Full Stack Application
echo   CPAN 212 - Modern Web Technologies
echo   Humber Polytechnic - Winter 2026
echo ============================================================
echo.
echo Starting all services with Docker Compose...
echo This may take a few minutes on first run.
echo.
echo Once started:
echo   Frontend:           http://localhost:3000
echo   API Gateway:        http://localhost:8080
echo   Keycloak Admin:     http://localhost:9090  (admin / Welcome2026$)
echo.
echo Demo Accounts:
echo   Admin:    admin1@example.com     / Admin@123
echo   Vendor:   vendor1@example.com    / Vendor@123
echo   Customer: customer1@example.com  / password123
echo.
docker-compose up --build
