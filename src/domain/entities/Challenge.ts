import type { Difficulty } from './Difficulty.js';
import type { Category } from './Category.js';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  writeup: string | null;
  imageUrl: string | null;
  flag: string;
  points: number;
  difficulty: Difficulty;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

/** Challenge sin la flag secreta (para endpoints públicos). */
export type PublicChallenge = Omit<Challenge, 'flag'>;
