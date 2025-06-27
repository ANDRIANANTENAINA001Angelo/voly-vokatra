@echo off
echo Starting all services...

@REM === SERVICES ===
start cmd /k "cd /d %~dp0auth-service && start.bat"
start cmd /k "cd /d %~dp0culture-service && start.bat"
start cmd /k "cd /d %~dp0localisation-service && start.bat"
start cmd /k "cd /d %~dp0meteo-service && start.bat"
start cmd /k "cd /d %~dp0notification-service && start.bat"
start cmd /k "cd /d %~dp0recommandation-service && start.bat"

@REM === API GATEWAY ===
start cmd /k "cd /d %~dp0api-gateway && start.bat"

@REM === TEMPORAL WORKER ===
start cmd /k "cd /d %~dp0temporal-worker && start.bat"

echo All services started in separate terminals.


exit

