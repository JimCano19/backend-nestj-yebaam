import { Module } from '@nestjs/common';
import { DrizzleService, POSTGRES_CONFIG } from './services/drizzle.service';
import { AuroraConfigService } from './services/aurora-config.service';
import { DatabaseHealthService } from './services/database-health.service';
import { envs } from '@config/envs';

@Module({
  providers: [
    {
      provide: POSTGRES_CONFIG,
      useFactory: () => envs.database,
    },
    DrizzleService,
    AuroraConfigService,
    DatabaseHealthService,
  ],
  exports: [DrizzleService, DatabaseHealthService],
})
export class DrizzleModule {}
