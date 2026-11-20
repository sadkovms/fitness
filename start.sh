#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   🥗 NutriVision AI — Запуск...         ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден!"
    echo ""
    echo "Скачайте Node.js с https://nodejs.org/"
    echo "(рекомендуется версия 18 или выше)"
    echo ""
    read -p "Нажмите Enter для выхода..."
    exit 1
fi

echo "✅ Node.js найден: $(node --version)"
echo ""

# Проверяем наличие node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    echo "(это займёт 1-2 минуты при первом запуске)"
    echo ""
    npm install
    echo ""
fi

echo "🚀 Запускаем сервер..."
echo ""
echo "════════════════════════════════════════════"
echo " Приложение откроется автоматически!"
echo " Если не открылось — перейдите по ссылке:"
echo " 👉 http://localhost:3000"
echo "════════════════════════════════════════════"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Открываем браузер (кроссплатформенно)
sleep 2 && open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null &

npm run dev
