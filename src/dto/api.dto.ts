import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Estado general de la aplicación' })
  status: string;

  @ApiProperty({ example: '2025-08-22T21:36:32.257Z', description: 'Timestamp de la respuesta' })
  timestamp: string;

  @ApiProperty({ example: 'production', description: 'Ambiente donde se ejecuta la aplicación' })
  environment: string;
}

export class DatabaseStatusDto {
  @ApiProperty({ example: 'connected', description: 'Estado de la conexión a la base de datos' })
  status: string;

  @ApiProperty({ example: 'backend_api_db', description: 'Nombre de la base de datos' })
  database: string;

  @ApiProperty({ example: 'localhost', description: 'Host de la base de datos' })
  host: string;

  @ApiProperty({ example: 'drizzle', description: 'ORM utilizado' })
  orm: string;

  @ApiProperty({ example: '2025-08-22T21:36:45.803Z', description: 'Timestamp de la respuesta' })
  timestamp: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email único del usuario' })
  email: string;
}

export class UserDto {
  @ApiProperty({ example: 1, description: 'ID único del usuario' })
  id: number;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email único del usuario' })
  email: string;

  @ApiProperty({ example: '2025-08-22T21:36:45.803Z', description: 'Fecha de creación' })
  createdAt: string;

  @ApiProperty({ example: '2025-08-22T21:36:45.803Z', description: 'Fecha de última actualización' })
  updatedAt: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ example: true, description: 'Indica si la operación fue exitosa' })
  success: boolean;

  @ApiProperty({ type: UserDto, description: 'Datos del usuario creado' })
  user: UserDto;
}

export class GetUsersResponseDto {
  @ApiProperty({ example: true, description: 'Indica si la operación fue exitosa' })
  success: boolean;

  @ApiProperty({ example: 5, description: 'Número total de usuarios' })
  count: number;

  @ApiProperty({ type: [UserDto], description: 'Lista de usuarios' })
  users: UserDto[];
}

export class ErrorResponseDto {
  @ApiProperty({ example: false, description: 'Indica que la operación falló' })
  success: boolean;

  @ApiProperty({ example: 'Database connection failed', description: 'Mensaje de error' })
  error: string;
}
