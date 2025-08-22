import { Injectable } from '@nestjs/common';
import { db } from './db';
import { users, type NewUser } from './schema';
import { sql } from 'drizzle-orm';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getDatabaseStatus() {
    try {
      if (!db) {
        return {
          status: 'error',
          message: 'Database not initialized - check environment variables',
          timestamp: new Date().toISOString()
        };
      }
      
      // Intentar hacer una consulta simple
      await db.execute(sql`SELECT 1`);
      return {
        status: 'connected',
        database: process.env.DB_NAME || 'not configured',
        host: process.env.DB_HOST || 'not configured',
        orm: 'drizzle',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async createUser(userData: NewUser) {
    try {
      if (!db) {
        return {
          success: false,
          error: 'Database not available'
        };
      }
      
      const [user] = await db.insert(users).values(userData).returning();
      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUsers() {
    try {
      if (!db) {
        return {
          success: false,
          error: 'Database not available'
        };
      }
      
      const allUsers = await db.select().from(users);
      return {
        success: true,
        count: allUsers.length,
        users: allUsers
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
