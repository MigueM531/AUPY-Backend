import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { IUserRepository } from '../../domain/repositories/index.js';
import type { SafeUser } from '../../domain/entities/index.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback_dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '24h';

export class AuthService {
  constructor(private readonly userRepo: IUserRepository) {}

  async register(name: string, email: string, password: string): Promise<{ user: SafeUser; token: string }> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw Object.assign(new Error('El email ya está registrado.'), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    });

    const token = this.generateToken(user.id, user.role);
    const { password: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  async login(email: string, password: string): Promise<{ user: SafeUser; token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw Object.assign(new Error('Credenciales inválidas.'), { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw Object.assign(new Error('Credenciales inválidas.'), { status: 401 });
    }

    const token = this.generateToken(user.id, user.role);
    const { password: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  private generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
  }
}
