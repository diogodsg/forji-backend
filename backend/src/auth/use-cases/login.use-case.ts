import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repositories/auth.repository';

interface LoginDto {
  email: string;
  password: string;
}

/**
 * Service for password operations (reuse from users module)
 * This is a temporary placeholder - should import from users module
 */
import * as bcrypt from 'bcrypt';

/**
 * Use Case: Login
 * Authenticates user and returns JWT token
 */
@Injectable()
export class LoginUseCase {
  logger = new Logger(LoginUseCase.name);
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto) {
    this.logger.debug({ email: loginDto.email }, 'debug');
    const user = await this.authRepository.findUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user's workspaces
    const workspaces = user.workspaceMemberships.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      role: membership.role,
    }));

    // Use first workspace as default (or primary workspace logic)
    const primaryWorkspace = user.workspaceMemberships[0];
    if (!primaryWorkspace) {
      throw new UnauthorizedException('User has no workspace access');
    }

    // Generate JWT token with workspace context
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      workspaceId: primaryWorkspace.workspaceId,
      workspaceRole: primaryWorkspace.role,
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
      },
      workspaces,
    };
  }
}
