
import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


export function setupSecurity(app: INestApplication): void {
  app.use(helmet());

  // Rate limiting configuration for Elastic Beanstalk
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // máximo 100 requests por IP
      message: 'Demasiadas solicitudes desde esta IP, inténtalo más tarde.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
}
