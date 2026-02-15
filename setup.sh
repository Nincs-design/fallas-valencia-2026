#!/bin/bash

# 🎊 Fallas València 2026 - Setup Script
# Este script instala y configura el proyecto React

echo "🎊 =========================================="
echo "   Fallas València 2026 - Setup"
echo "   Migrando de Vanilla JS a React + TS"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Descárgalo de: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo "✅ npm detectado: $(npm --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Instalando dependencias..."
echo "   Esto puede tardar unos minutos..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Instalación completada!"
    echo ""
    echo "🚀 Para iniciar el proyecto:"
    echo "   npm run dev"
    echo ""
    echo "📖 Otros comandos útiles:"
    echo "   npm run build   - Build para producción"
    echo "   npm run preview - Preview del build"
    echo "   npm run lint    - Linting"
    echo ""
    echo "📚 Documentación:"
    echo "   README.md       - Guía completa"
    echo "   MIGRACION.md    - Comparación JS vs React"
    echo ""
    echo "🎨 La app estará disponible en:"
    echo "   http://localhost:5173"
    echo ""
else
    echo ""
    echo "❌ Error durante la instalación"
    echo "   Intenta ejecutar: npm install --legacy-peer-deps"
    echo ""
    exit 1
fi
