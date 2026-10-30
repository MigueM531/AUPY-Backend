import type { Challenge } from '../../domain/entities/index.js';
import type {
  IChallengeRepository,
  PaginationParams,
  PaginatedResult,
} from '../../domain/repositories/index.js';
import prisma from '../prisma.js';

export class PrismaChallengeRepository implements IChallengeRepository {
  async create(data: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge> {
    return prisma.challenge.create({ data });
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<Challenge>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.challenge.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.challenge.count(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Challenge | null> {
    return prisma.challenge.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Partial<Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Challenge> {
    return prisma.challenge.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.challenge.delete({ where: { id } });
  }
}
