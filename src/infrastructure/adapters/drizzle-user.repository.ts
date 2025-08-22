import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { UserRepositoryPort } from '../../core/domain/ports/user-repository.port';
import { User, CreateUserData, UpdateUserData } from '../../core/domain/entities/user.entity';
import { users } from '../config/schema';
import { db } from '../config/database';

@Injectable()
export class DrizzleUserRepository implements UserRepositoryPort {
  async findAll(): Promise<User[]> {
    const result = await db.select().from(users);
    return result.map(this.mapToEntity);
  }

  async findById(id: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return result.length > 0 ? this.mapToEntity(result[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result.length > 0 ? this.mapToEntity(result[0]) : null;
  }

  async create(userData: CreateUserData): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        name: userData.name,
        email: userData.email,
      })
      .returning();

    return this.mapToEntity(result[0]);
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const updateData = {
      ...userData,
      updatedAt: new Date(),
    };

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return result.length > 0 ? this.mapToEntity(result[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return result.length > 0;
  }

  async exists(id: string): Promise<boolean> {
    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result.length > 0;
  }

  private mapToEntity(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    };
  }
}
