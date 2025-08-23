
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Social Network API')
    .setDescription(
      'API para administración de la red social - Gestión de usuarios administradores, contenido y moderación',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag(
      'Admin Authentication',
      'Endpoints para autenticación y gestión de administradores',
    )
    .addTag('User Management', 'Endpoints para gestión de usuarios de la red social')
    .addTag(
      'Content Management',
      'Endpoints para gestión de contenido y moderación',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, 
    },
  });
}
