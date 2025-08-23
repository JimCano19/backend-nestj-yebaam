import { envs } from '@config/envs';
import { Injectable, Logger } from '@nestjs/common';

export interface AuroraConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
  connectTimeoutMS?: number;
  maxConnections?: number;
  idleTimeoutMS?: number;
}

@Injectable()
export class AuroraConfigService {
  private readonly logger = new Logger(AuroraConfigService.name);

  getConfig(): AuroraConfig {
    const config = envs.database;
    
    this.logger.log(`Configuring database connection to: ${config.host}:${config.port}`);
    
    // Aurora-specific optimizations
    const auroraConfig: AuroraConfig = {
      ...config,
      connectTimeoutMS: 60000, // 60 seconds
      maxConnections: 20,
      idleTimeoutMS: 30000, // 30 seconds
    };

    // Additional SSL configuration for Aurora
    if (envs.NODE_ENV === 'production' && config.ssl) {
      auroraConfig.ssl = {
        rejectUnauthorized: false, // Aurora uses self-signed certificates
      };
    }

    return auroraConfig;
  }

  isAuroraEnvironment(): boolean {
    return envs.NODE_ENV === 'production' && !!envs.database.host.includes('aurora');
  }
}
