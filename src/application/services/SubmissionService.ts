import type { ISubmissionRepository } from '../../domain/repositories/index.js';
import type { IChallengeRepository } from '../../domain/repositories/index.js';
import type { Submission } from '../../domain/entities/index.js';

export class SubmissionService {
  constructor(
    private readonly submissionRepo: ISubmissionRepository,
    private readonly challengeRepo: IChallengeRepository,
  ) {}

  /**
   * Crea una submission comparando la flag enviada con la flag real del challenge.
   * El userId se obtiene SIEMPRE del token (nunca del body).
   */
  async submit(userId: string, challengeId: string, flagSubmitted: string): Promise<Submission> {
    const challenge = await this.challengeRepo.findById(challengeId);
    if (!challenge) {
      throw Object.assign(new Error('Challenge no encontrado.'), { status: 404 });
    }

    const isCorrect = flagSubmitted.trim() === challenge.flag.trim();

    return this.submissionRepo.create({
      userId,
      challengeId,
      flagSubmitted,
      isCorrect,
    });
  }

  /**
   * Devuelve las submissions del usuario autenticado.
   */
  async getMySubmissions(userId: string): Promise<Submission[]> {
    return this.submissionRepo.findByUserId(userId);
  }

  /**
   * Devuelve TODAS las submissions (solo ADMIN).
   */
  async getAll(): Promise<Submission[]> {
    return this.submissionRepo.findAll();
  }
}
