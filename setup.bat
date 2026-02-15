@echo off
REM Fallas Valencia 2026 - Setup Script for Windows

echo ==========================================
echo    Fallas Valencia 2026 - Setup
echo    Migrando de Vanilla JS a React + TS
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado
    echo         Descargalo de: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detectado
node --version
echo [OK] npm detectado
npm --version
echo.

echo Instalando dependencias...
echo Esto puede tardar unos minutos...
echo.

npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Instalacion completada!
    echo.
    echo Para iniciar el proyecto:
    echo    npm run dev
    echo.
    echo Otros comandos utiles:
    echo    npm run build   - Build para produccion
    echo    npm run preview - Preview del build
    echo    npm run lint    - Linting
    echo.
    echo Documentacion:
    echo    README.md       - Guia completa
    echo    MIGRACION.md    - Comparacion JS vs React
    echo.
    echo La app estara disponible en:
    echo    http://localhost:5173
    echo.
) else (
    echo.
    echo [ERROR] Error durante la instalacion
    echo         Intenta ejecutar: npm install --legacy-peer-deps
    echo.
    pause
    exit /b 1
)

pause
