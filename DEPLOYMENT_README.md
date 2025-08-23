# Configuración de nginx y deployment para NestJS en AWS Elastic Beanstalk

## Archivos creados:

### 1. `.platform/nginx/conf.d/app.conf`
- Configuración personalizada de nginx para proxy reverso
- Manejo de errores 502/503/504
- Configuración optimizada para NestJS
- Timeouts y buffers ajustados

### 2. `.platform/nginx/nginx.conf`
- Configuración global de nginx
- Optimizaciones de rendimiento
- Compresión habilitada
- Rate limiting configurado

### 3. `.platform/hooks/postdeploy/01_verify_app.sh`
- Hook que se ejecuta después del deploy
- Verifica que la aplicación responda en puerto 8080
- Muestra logs de debugging

### 4. `.platform/confighooks/predeploy/01_install_deps.sh`
- Hook que se ejecuta antes del deploy
- Instala dependencias
- Verifica que el build exista

## Problemas solucionados:

1. **Error 502 Bad Gateway**: nginx configurado correctamente para proxy a puerto 8080
2. **Timeouts**: Aumentados para aplicaciones más lentas
3. **Dependencias faltantes**: class-validator y class-transformer agregados
4. **Monitoring**: Hooks para verificar el estado de la aplicación

## Para deployar:

Puedes usar cualquiera de estos métodos:

### Método 1: GitHub Actions (automático)
```bash
git add .
git commit -m "feat: add nginx config and fix dependencies"
git push origin main
```

### Método 2: EB CLI directo
```bash
eb deploy
```

### Método 3: Manual con AWS CLI
```bash
zip -r deploy.zip . -x ".git/*" "node_modules/*" "*.zip"
aws elasticbeanstalk create-application-version --application-name nest-api-yebaam --version-label "v-$(date +%s)" --source-bundle S3Bucket="tu-bucket",S3Key="deploy.zip"
```

## Monitoring después del deploy:

```bash
# Ver logs
aws elasticbeanstalk request-environment-info --environment-name Nest-api-yebaam-env --info-type tail
aws elasticbeanstalk retrieve-environment-info --environment-name Nest-api-yebaam-env --info-type tail

# Ver estado
aws elasticbeanstalk describe-environment-health --environment-name Nest-api-yebaam-env --attribute-names All
```
