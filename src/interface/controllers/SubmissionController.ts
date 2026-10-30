import type { Request, Response, NextFunction } from 'express';
import type { SubmissionService } from '../../application/services/index.js';

export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  /**
   * Crea una nueva submission.
   * El userId se toma del token (NUNCA del body).
   */
  submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId as string;
      const { challengeId, flagSubmitted } = req.body as { challengeId: string; flagSubmitted: string };

      if (!challengeId || !flagSubmitted) {
        res.status(400).json({ success: false, message: 'challengeId y flagSubmitted son requeridos.' });
        return;
      }

      const submission = await this.submissionService.submit(userId, challengeId, flagSubmitted);

      res.status(201).json({ success: true, data: submission });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Devuelve las submissions del usuario autenticado.
   */
  getMine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId as string;
      const submissions = await this.submissionService.getMySubmissions(userId);

      res.status(200).json({ success: true, data: submissions });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Devuelve TODAS las submissions (solo ADMIN).
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const submissions = await this.submissionService.getAll();

      res.status(200).json({ success: true, data: submissions });
    } catch (error) {
      next(error);
    }
  };
}
