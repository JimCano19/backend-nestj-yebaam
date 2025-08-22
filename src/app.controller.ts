import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('db-status')
  async getDatabaseStatus() {
    return this.appService.getDatabaseStatus();
  }

  @Post('users')
  async createUser(@Body() userData: { name: string; email: string }) {
    return this.appService.createUser(userData);
  }

  @Get('users')
  async getUsers() {
    return this.appService.getUsers();
  }
}
