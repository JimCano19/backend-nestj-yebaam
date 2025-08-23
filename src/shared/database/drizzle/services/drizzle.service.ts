import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';
import { sql } from 'drizzle-orm';

const postgres = require('postgres');

export interface PostgresConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

export const POSTGRES_CONFIG = 'POSTGRES_CONFIG';

@Injectable()
export class DrizzleService implements OnModuleInit {
  private db: ReturnType<typeof drizzle>;
  private client: ReturnType<typeof postgres>;

  constructor(@Inject(POSTGRES_CONFIG) private config: PostgresConfig) {}

  async onModuleInit() {
    this.client = postgres({
      host: this.config.host,
      port: this.config.port,
      username: this.config.user,
      password: this.config.password,
      database: this.config.database,
      ssl: this.config.ssl,
    });

    this.db = drizzle(this.client, { schema });

    // Test connection
    try {
      await this.client`SELECT 1`;
      console.log(' Drizzle PostgreSQL connected successfully');
    } catch (error) {
      console.error(' Drizzle PostgreSQL connection failed:', error);
    }
  }

  getDb() {
    return this.db;
  }

  async closeConnection() {
    await this.client.end();
  }



}
