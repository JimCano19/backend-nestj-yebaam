import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AppService } from '../../app.service';
import {
  HealthResponseDto,
  DatabaseStatusDto,
  UserDto,
  CreateUserDto,
  GetUsersResponseDto,
  CreateUserResponseDto,
  ErrorResponseDto,
} from '../../dto/api.dto';import { Body, Controller, Get, Post } from '@nestjs/common';
@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Mensaje de bienvenida', description: 'Endpoint básico que retorna un saludo' })
  @ApiResponse({ status: 200, description: 'Saludo exitoso', schema: { example: 'Hello World!' } })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiTags('health')
  @ApiOperation({ 
    summary: 'Estado de salud de la aplicación', 
    description: 'Verifica que la aplicación esté funcionando correctamente' 
  })
  @ApiResponse({ status: 200, description: 'Estado de salud obtenido exitosamente', type: HealthResponseDto })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('db-status')
  @ApiTags('database')
  @ApiOperation({ 
    summary: 'Estado de la base de datos', 
    description: 'Verifica la conectividad y estado de la base de datos PostgreSQL' 
  })
  @ApiResponse({ status: 200, description: 'Estado de la base de datos obtenido', type: DatabaseStatusDto })
  @ApiResponse({ status: 500, description: 'Error al conectar con la base de datos', type: ErrorResponseDto })
  async getDatabaseStatus() {
    return this.appService.getDatabaseStatus();
  }

  @Post('users')
  @ApiTags('users')
  @ApiOperation({ 
    summary: 'Crear nuevo usuario', 
    description: 'Crea un nuevo usuario en la base de datos con nombre y email' 
  })
  @ApiBody({ type: CreateUserDto, description: 'Datos del usuario a crear' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: CreateUserResponseDto })
  @ApiResponse({ status: 400, description: 'Error en los datos proporcionados', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: ErrorResponseDto })
  async createUser(@Body() userData: CreateUserDto) {
    return this.appService.createUser(userData);
  }

  @Get('users')
  @ApiTags('users')
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios', 
    description: 'Retorna la lista completa de usuarios registrados en la base de datos' 
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente', type: GetUsersResponseDto })
  @ApiResponse({ status: 500, description: 'Error al obtener usuarios', type: ErrorResponseDto })
  async getUsers() {
    return this.appService.getUsers();
  }
}
