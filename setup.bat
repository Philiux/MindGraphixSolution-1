@echo off
echo ========================================
echo Installation des dépendances MindGraphix
echo ========================================
echo.

echo Installation des dépendances frontend...
cd frontend
call npm install
cd ..

echo.
echo Installation des dépendances backend...
echo Gateway...
cd backend\gateway
call pip install -r requirements.txt
cd ..\..

echo Auth Service...
cd backend\auth-service
call pip install -r requirements.txt
cd ..\..

echo User Service...
cd backend\user-service
call pip install -r requirements.txt
cd ..\..

echo Project Service...
cd backend\project-service
call pip install -r requirements.txt
cd ..\..

echo Service Service...
cd backend\service-service
call pip install -r requirements.txt
cd ..\..

echo Contact Service...
cd backend\contact-service
call pip install -r requirements.txt
cd ..\..

echo.
echo ========================================
echo Installation terminée !
echo ========================================
echo.
echo Pour démarrer les services :
echo - Avec Docker : make up
echo - Frontend seulement : cd frontend && npm run dev
pause
