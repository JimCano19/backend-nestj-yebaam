import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Yebaam API')
    .setDescription('API Backend para Yebaam - Sistema de gestión con NestJS y Drizzle ORM')
    .setVersion('1.0')
    .addTag('health', 'Endpoints de salud y estado del sistema')
    .addTag('database', 'Endpoints relacionados con la base de datos')
    .addTag('users', 'Gestión de usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Yebaam API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
