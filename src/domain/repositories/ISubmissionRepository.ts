import type { Submission } from '../entities/index.js';

export interface ISubmissionRepository {
  create(data: Omit<Submission, 'id' | 'createdAt'>): Promise<Submission>;
  findByUserId(userId: string): Promise<Submission[]>;
  findAll(): Promise<Submission[]>;
}
