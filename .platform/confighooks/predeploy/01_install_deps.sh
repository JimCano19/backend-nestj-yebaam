#!/bin/bash

# Hook pre-deploy para configurar el entorno

echo "=== Pre-deploy hook iniciado ==="

# Asegurar que todas las dependencias están instaladas
echo "Verificando instalación de dependencias..."
cd /var/app/staging
npm install --production

# Verificar que el archivo de configuración exista
echo "Verificando archivos de configuración..."
if [ ! -f "dist/main.js" ]; then
    echo "⚠️  Archivo dist/main.js no encontrado, ejecutando build..."
    npm run build
fi

echo "=== Pre-deploy hook completado ==="
