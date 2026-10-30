import type { IChallengeRepository, PaginatedResult } from '../../domain/repositories/index.js';
import type { Challenge, PublicChallenge } from '../../domain/entities/index.js';
import type { Difficulty } from '../../domain/entities/Difficulty.js';
import type { Category } from '../../domain/entities/Category.js';

export interface CreateChallengeDTO {
  title: string;
  description: string;
  writeup?: string;
  imageUrl?: string;
  flag: string;
  points: number;
  difficulty: Difficulty;
  category: Category;
}

export interface UpdateChallengeDTO {
  title?: string;
  description?: string;
  writeup?: string;
  imageUrl?: string;
  flag?: string;
  points?: number;
  difficulty?: Difficulty;
  category?: Category;
}

export class ChallengeService {
  constructor(private readonly challengeRepo: IChallengeRepository) {}


  async getAll(page: number, limit: number): Promise<PaginatedResult<PublicChallenge>> {
    const result = await this.challengeRepo.findAll({ page, limit });

    const sanitized: PublicChallenge[] = result.data.map(({ flag, ...rest }) => rest);

    return { data: sanitized, pagination: result.pagination };
  }


  async getById(id: string): Promise<PublicChallenge> {
    const challenge = await this.challengeRepo.findById(id);
    if (!challenge) {
      throw Object.assign(new Error('Challenge no encontrado.'), { status: 404 });
    }

    const { flag, ...publicChallenge } = challenge;
    return publicChallenge;
  }

  async create(data: CreateChallengeDTO): Promise<Challenge> {
    return this.challengeRepo.create({
      title: data.title,
      description: data.description,
      writeup: data.writeup ?? null,
      imageUrl: data.imageUrl ?? null,
      flag: data.flag,
      points: data.points,
      difficulty: data.difficulty,
      category: data.category,
    });
  }

  async update(id: string, data: UpdateChallengeDTO): Promise<Challenge> {

    const existing = await this.challengeRepo.findById(id);
    if (!existing) {
      throw Object.assign(new Error('Challenge no encontrado.'), { status: 404 });
    }

    return this.challengeRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.challengeRepo.findById(id);
    if (!existing) {
      throw Object.assign(new Error('Challenge no encontrado.'), { status: 404 });
    }

    await this.challengeRepo.delete(id);
  }
}
