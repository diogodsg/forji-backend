import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repositories/auth.repository';

interface GoogleUserProfile {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

/**
 * GoogleOAuthUseCase
 * Handles login via Google OAuth
 * - Only allows login for existing users
 * - Users must create an account first via traditional registration
 */
@Injectable()
export class GoogleOAuthUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(profile: GoogleUserProfile) {
    const { email, picture } = profile;

    // Check if user already exists
    const user = await this.authRepository.findUserByEmail(email);

    // If user doesn't exist, deny login
    if (!user) {
      throw new UnauthorizedException(
        'No account found with this email. Please create an account first.',
      );
    }

    // Get user's primary workspace (first membership)
    const membership = user.workspaceMemberships[0];
    if (!membership) {
      throw new UnauthorizedException('User has no workspace membership');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      workspaceId: membership.workspaceId,
      workspaceRole: membership.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        position: user.position,
        bio: user.bio,
        picture: picture || null,
      },
      workspace: {
        id: membership.workspace.id,
        name: membership.workspace.name,
        slug: membership.workspace.slug,
        role: membership.role,
      },
    };
  }
}
