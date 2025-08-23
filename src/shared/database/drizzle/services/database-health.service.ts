import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DatabaseHealthService {
  private readonly logger = new Logger(DatabaseHealthService.name);

  constructor(private readonly drizzleService: DrizzleService) {}

  async checkHealth(): Promise<{ status: string; database: string; timestamp: Date }> {
    try {
      // Test basic connection
      const db = this.drizzleService.getDb();
      const result = await db.execute(`SELECT 1 as health_check, NOW() as server_time`);
      
      this.logger.log('Database health check passed');
      
      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date(),
      };
    }
  }

  async checkAuroraSpecificHealth(): Promise<{ 
    isAurora: boolean; 
    version: string; 
    readOnly: boolean 
  }> {
    try {
      const db = this.drizzleService.getDb();
      
      // Check if we're connected to Aurora
      const versionResult = await db.execute(`SELECT version() as version`);
      const readOnlyResult = await db.execute(`SHOW transaction_read_only`);
      
      const version = (versionResult as any)[0]?.version || 'unknown';
      const isAurora = version.includes('Aurora');
      const readOnly = (readOnlyResult as any)[0]?.transaction_read_only === 'on';
      
      return {
        isAurora,
        version,
        readOnly,
      };
    } catch (error) {
      this.logger.error('Aurora health check failed:', error);
      throw error;
    }
  }
}
