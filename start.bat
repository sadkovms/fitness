@echo off
chcp 65001 >nul
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   🥗 NutriVision AI — Запуск...         ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Проверяем наличие Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  ❌ Node.js не найден!
    echo.
    echo  Скачайте Node.js с https://nodejs.org/
    echo  (рекомендуется версия 18 или выше)
    echo.
    pause
    exit /b 1
)

echo  ✅ Node.js найден: 
node --version
echo.

:: Проверяем наличие node_modules
if not exist "node_modules\" (
    echo  📦 Устанавливаем зависимости...
    echo  (это займёт 1-2 минуты при первом запуске)
    echo.
    call npm install
    echo.
)

echo  🚀 Запускаем сервер...
echo.
echo  ════════════════════════════════════════════
echo   Приложение откроется автоматически!
echo   Если не открылось — перейдите по ссылке:
echo   👉 http://localhost:3000
echo  ════════════════════════════════════════════
echo.
echo  Для остановки нажмите Ctrl+C
echo.

start http://localhost:3000
call npm run dev
