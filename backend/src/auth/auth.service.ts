import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from './use-cases/login.use-case';
import { RegisterUseCase } from './use-cases/register.use-case';
import { ValidateTokenUseCase } from './use-cases/validate-token.use-case';
import { GoogleOAuthUseCase } from './use-cases/google-oauth.use-case';
import { AuthRepository } from './repositories/auth.repository';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';

/**
 * Auth Service - Refactored
 * Facade pattern that delegates to use cases
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    private readonly googleOAuthUseCase: GoogleOAuthUseCase,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }

  async register(registerDto: RegisterDto) {
    return this.registerUseCase.execute({
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
      workspaceName: registerDto.workspaceName,
      workspaceSlug:
        registerDto.workspaceSlug || registerDto.workspaceName.toLowerCase().replace(/\s+/g, '-'),
    });
  }

  async validateToken(token: string) {
    return this.validateTokenUseCase.execute(token);
  }

  // Methods needed by strategies
  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getUserById(userId: string) {
    return this.authRepository.findUserById(userId);
  }

  async switchWorkspace(userId: string, workspaceId: string) {
    // Find user and verify they have access to the workspace
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const membership = user.workspaceMemberships.find((m) => m.workspaceId === workspaceId);
    if (!membership) {
      throw new NotFoundException('Workspace not found or access denied');
    }

    // Generate new token with updated workspace context
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
      },
      workspace: {
        id: membership.workspace.id,
        name: membership.workspace.name,
        slug: membership.workspace.slug,
        role: membership.role,
      },
    };
  }

  async googleLogin(user: any) {
    return this.googleOAuthUseCase.execute(user);
  }
}
