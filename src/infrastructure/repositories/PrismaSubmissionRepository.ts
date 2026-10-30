import type { Submission } from '../../domain/entities/index.js';
import type { ISubmissionRepository } from '../../domain/repositories/index.js';
import prisma from '../prisma.js';

export class PrismaSubmissionRepository implements ISubmissionRepository {
  async create(data: Omit<Submission, 'id' | 'createdAt'>): Promise<Submission> {
    return prisma.submission.create({ data });
  }

  async findByUserId(userId: string): Promise<Submission[]> {
    return prisma.submission.findMany({
      where: { userId },
      include: { challenge: { select: { title: true, points: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<Submission[]> {
    return prisma.submission.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        challenge: { select: { title: true, points: true, category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
