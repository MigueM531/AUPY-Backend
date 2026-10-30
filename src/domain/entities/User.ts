import type { Role } from './Role.js';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

/** Datos que se devuelven al cliente (sin password). */
export type SafeUser = Omit<User, 'password'>;
