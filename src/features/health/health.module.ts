import { Module } from '@nestjs/common';
import { DatabaseHealthService } from '@shared/database/drizzle/services/database-health.service';
import { HealthController } from './health.controller';

@Module({
    imports: [],
    controllers: [HealthController],
    providers: [DatabaseHealthService],
    exports: [DatabaseHealthService],
})
export class HealthModule {}
