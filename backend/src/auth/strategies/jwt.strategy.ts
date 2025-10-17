import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

/**
 * JWT Payload structure (camelCase)
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  workspaceId: string; // Current workspace
  workspaceRole: string; // Role in workspace (OWNER, ADMIN, MEMBER)
  iat?: number;
  exp?: number;
}

/**
 * JWT Strategy for token validation
 * Used to protect routes with @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret-change-me',
    });
  }

  /**
   * Validate JWT token and attach user to request
   * The payload comes from the JWT token (camelCase)
   */
  async validate(payload: JwtPayload) {
    // Fetch fresh user data from database
    const user = await this.authService.getUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Attach user and workspace context to request (camelCase)
    return {
      ...user,
      workspaceId: payload.workspaceId,
      workspaceRole: payload.workspaceRole,
    };
  }
}
