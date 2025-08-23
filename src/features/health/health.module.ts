import { Module } from '@nestjs/common';
import { DatabaseHealthService } from '@shared/database/drizzle/services/database-health.service';
import { HealthController } from './health.controller';
import { DrizzleModule } from '@shared/database/drizzle/drizzle.module';

@Module({
    imports: [DrizzleModule],
    controllers: [HealthController],
    providers: [DatabaseHealthService],
    exports: [DatabaseHealthService],
})
export class HealthModule {}
