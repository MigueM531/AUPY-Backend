import type { Challenge } from '../entities/index.js';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IChallengeRepository {
  create(data: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge>;
  findAll(params: PaginationParams): Promise<PaginatedResult<Challenge>>;
  findById(id: string): Promise<Challenge | null>;
  update(id: string, data: Partial<Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Challenge>;
  delete(id: string): Promise<void>;
}
