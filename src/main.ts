import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { json } from 'express';
import { setupSecurity } from '@config/security.config';
import { setupCors } from '@config/cors.config';
import { setupSwagger } from '@shared/doc/swagger.config';
import { envs } from '@config/envs';
import { baseUrl } from '@config/url.config';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger('API-MAIN');

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // Configurar trust proxy para Elastic Beanstalk
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  setupSecurity(app);
  setupCors(app);

  app.use(json({ limit: '60mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  setupSwagger(app);
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');

  logger.log(`SERVER RUNNING ON ${baseUrl}`);
  logger.log(`SWAGGER DOCS: ${baseUrl}/api/doc`);
  logger.log(`GRAPHQL: ${baseUrl}/api`);
  logger.log(`ENVIRONMENT: ${envs.NODE_ENV}`);
  logger.log(`VERSION: v1`);

}
void bootstrap();
