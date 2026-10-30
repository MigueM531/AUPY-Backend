import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback_dev_secret';

export interface AuthPayload {
  userId: string;
  role: string;
}

/**
 * Middleware de autenticación.
 * Verifica el Bearer Token del header Authorization.
 * Inyecta `userId` y `role` en `req` para uso posterior.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    next(Object.assign(new Error('Token no proporcionado.'), { status: 401 }));
    return;
  }

  const token = header.split(' ')[1]!;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    (req as any).userId = decoded.userId;
    (req as any).role = decoded.role;
    next();
  } catch {
    next(Object.assign(new Error('Token inválido o expirado.'), { status: 401 }));
  }
}
