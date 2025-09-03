@echo off
echo ========================================
echo Nettoyage du projet MindGraphix
echo ========================================
echo.

echo Suppression des dépendances frontend...
if exist frontend\node_modules (
    rmdir /s /q frontend\node_modules
    echo node_modules supprimé
) else (
    echo node_modules non trouvé
)

echo.
echo Suppression des fichiers Python temporaires...
for /d /r backend %%d in (__pycache__) do (
    if exist "%%d" (
        rmdir /s /q "%%d"
        echo Supprimé: %%d
    )
)

for /r backend %%f in (*.pyc) do (
    if exist "%%f" (
        del /q "%%f"
        echo Supprimé: %%f
    )
)

echo.
echo Suppression des environnements virtuels Python...
for /d /r . %%d in (venv, env, .venv, .env) do (
    if exist "%%d" (
        rmdir /s /q "%%d"
        echo Supprimé: %%d
    )
)

echo.
echo Suppression des fichiers de build...
if exist frontend\.next (
    rmdir /s /q frontend\.next
    echo .next supprimé
)

if exist frontend\dist (
    rmdir /s /q frontend\dist
    echo dist supprimé
)

if exist frontend\build (
    rmdir /s /q frontend\build
    echo build supprimé
)

echo.
echo ========================================
echo Nettoyage terminé !
echo Le projet est maintenant prêt pour le partage.
echo Taille réduite au minimum.
echo ========================================
echo.
echo Pour réinstaller les dépendances plus tard :
echo - make install-all
echo - ou setup.bat
pause
