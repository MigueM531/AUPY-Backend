import type { User } from '../../domain/entities/index.js';
import type { IUserRepository } from '../../domain/repositories/index.js';
import prisma from '../prisma.js';

export class PrismaUserRepository implements IUserRepository {
  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}
