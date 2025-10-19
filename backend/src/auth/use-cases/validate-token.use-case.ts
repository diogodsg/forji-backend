import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repositories/auth.repository';

/**
 * Use Case: Validate Token
 * Validates JWT token and returns user info
 */
@Injectable()
export class ValidateTokenUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string) {
    try {
      // Verify and decode token
      const payload = this.jwtService.verify(token);

      // Get user from database
      const user = await this.authRepository.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        position: user.position,
        bio: user.bio,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
