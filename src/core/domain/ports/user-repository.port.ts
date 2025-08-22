import { User, CreateUserData, UpdateUserData } from '../entities/user.entity';

// Port - Interface que define qué operaciones necesita el dominio
export interface UserRepositoryPort {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserData): Promise<User>;
  update(id: string, userData: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
