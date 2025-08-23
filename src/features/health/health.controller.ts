import { Controller, Get } from '@nestjs/common';
import { DatabaseHealthService } from '@shared/database/drizzle/services/database-health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: DatabaseHealthService) {}

  @Get('database')
  async checkDatabase() {
    return await this.healthService.checkHealth();
  }

  @Get('aurora')
  async checkAurora() {
    try {
      return await this.healthService.checkAuroraSpecificHealth();
    } catch (error) {
      return {
        isAurora: false,
        version: 'unknown',
        readOnly: false,
        error: error.message,
      };
    }
  }

  @Get()
  async health() {
    const dbHealth = await this.healthService.checkHealth();
    
    return {
      status: dbHealth.status === 'healthy' ? 'ok' : 'error',
      timestamp: new Date(),
      database: dbHealth,
    };
  }
  
}
