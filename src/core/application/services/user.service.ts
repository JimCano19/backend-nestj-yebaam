import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { User, CreateUserData, UpdateUserData } from '../../domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepositoryPort,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async createUser(userData: CreateUserData): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException(`El email ${userData.email} ya está en uso`);
    }

    return await this.userRepository.create(userData);
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    // Verificar que el usuario existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Si se está actualizando el email, verificar que no esté en uso
    if (userData.email && userData.email !== existingUser.email) {
      const emailInUse = await this.userRepository.findByEmail(userData.email);
      if (emailInUse) {
        throw new ConflictException(`El email ${userData.email} ya está en uso`);
      }
    }

    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException(`No se pudo actualizar el usuario con ID ${id}`);
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const userExists = await this.userRepository.exists(id);
    if (!userExists) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error(`No se pudo eliminar el usuario con ID ${id}`);
    }
  }

  async userExists(id: string): Promise<boolean> {
    return await this.userRepository.exists(id);
  }
}
