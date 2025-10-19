import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repositories/auth.repository';
import * as bcrypt from 'bcrypt';

interface RegisterDto {
  email: string;
  password: string;
  name: string;
  workspaceName: string;
  workspaceSlug: string;
}

/**
 * Use Case: Register
 * Creates new user and workspace, returns JWT token
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.authRepository.findUserByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user, workspace, and membership in transaction
    const result = await this.authRepository.transaction(async (tx) => {
      // 1. Create user
      const user = await tx.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
        },
      });

      // 2. Create workspace
      const workspace = await tx.workspace.create({
        data: {
          name: registerDto.workspaceName,
          slug: registerDto.workspaceSlug,
        },
      });

      // 3. Add user as workspace owner
      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      });

      return { user, workspace };
    });

    // Generate JWT token with workspace context
    const payload = {
      sub: result.user.id,
      email: result.user.email,
      name: result.user.name,
      workspaceId: result.workspace.id,
      workspaceRole: 'OWNER', // User created workspace, so they are OWNER
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      workspace: {
        id: result.workspace.id,
        name: result.workspace.name,
        slug: result.workspace.slug,
      },
    };
  }
}
