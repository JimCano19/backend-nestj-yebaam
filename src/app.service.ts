import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDatabaseStatus() {
    try {
      // Intentar hacer una consulta simple
      await this.dataSource.query('SELECT 1');
      return {
        status: 'connected',
        database: process.env.DB_NAME || 'not configured',
        host: process.env.DB_HOST || 'not configured',
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

  async createUser(userData: { name: string; email: string }) {
    try {
      const user = this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(user);
      return {
        success: true,
        user: savedUser
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
      const users = await this.userRepository.find();
      return {
        success: true,
        count: users.length,
        users
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
