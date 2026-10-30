import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware de autorización por rol.
 * Debe usarse DESPUÉS de authMiddleware.
 * Verifica que el usuario tenga el rol requerido.
 */
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const role = (req as any).role as string | undefined;

    if (!role || !allowedRoles.includes(role)) {
      next(Object.assign(new Error('No tienes permisos para acceder a este recurso.'), { status: 403 }));
      return;
    }

    next();
  };
}
