#!/bin/bash

# Hook post-deploy para verificar que la aplicación esté funcionando

echo "=== Post-deploy hook iniciado ==="

# Esperar a que la aplicación esté lista
sleep 10

# Verificar que la aplicación responda en el puerto 8080
echo "Verificando que la aplicación esté escuchando en puerto 8080..."
for i in {1..30}; do
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        echo "✅ Aplicación respondiendo correctamente en puerto 8080"
        break
    else
        echo "⏳ Esperando que la aplicación esté lista... (intento $i/30)"
        sleep 2
    fi
done

# Verificar logs de la aplicación
echo "=== Últimos logs de la aplicación ==="
tail -n 20 /var/log/web.stdout.log || echo "No se pudieron leer los logs de la aplicación"

# Verificar procesos de Node.js
echo "=== Procesos de Node.js ==="
ps aux | grep node || echo "No se encontraron procesos de Node.js"

echo "=== Post-deploy hook completado ==="
