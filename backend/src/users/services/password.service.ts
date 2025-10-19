import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for password operations
 * - Hashing passwords
 * - Comparing passwords
 * - Generating random passwords
 */
@Injectable()
export class PasswordService {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  }

  /**
   * Hash a plain text password
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare a plain text password with a hashed password
   */
  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate a random secure password
   */
  generate(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  /**
   * Validate password strength (optional - can be enhanced)
   */
  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
