import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): object {
    return {
      message: 'Nest API Yebaam is running!',
      status: 'OK',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        docs: '/api/doc',
        graphql: '/graphql'
      }
    };
  }
}
