import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto';
import { UserEntity, UserUtils } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, position, bio } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user, workspace and membership in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          position,
          bio,
        },
      });

      // Generate workspace slug from user name
      const workspaceSlug = `${name.toLowerCase().replace(/\s+/g, '-')}-workspace-${Date.now()}`;

      // Create default workspace
      const workspace = await tx.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          slug: workspaceSlug,
          description: 'Personal workspace',
          status: 'ACTIVE',
        },
      });

      // Add user as workspace owner
      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      });

      return { user, workspace };
    });

    // Transform to camelCase entity
    const userEntity = result.user;

    // Generate JWT token with workspace context
    const accessToken = this.generateToken(userEntity, result.workspace.id, 'OWNER');

    return {
      user: UserUtils.toSafeUser(userEntity),
      accessToken,
      workspaces: [
        {
          id: result.workspace.id,
          name: result.workspace.name,
          slug: result.workspace.slug,
          role: 'OWNER',
        },
      ],
    };
  }

  /**
   * Login user with email and password
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Validate user credentials
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user's workspaces
    const workspaceMemberships = await this.prisma.workspaceMember.findMany({
      where: { userId: user.id },
      include: {
        workspace: true,
      },
    });

    if (workspaceMemberships.length === 0) {
      throw new UnauthorizedException('User has no workspace access');
    }

    // Transform to camelCase entity
    const userEntity = user;

    // Use first workspace as default
    const defaultWorkspace = workspaceMemberships[0];

    // Generate JWT token with default workspace context
    const accessToken = this.generateToken(
      userEntity,
      defaultWorkspace.workspaceId,
      defaultWorkspace.role,
    );

    return {
      user: UserUtils.toSafeUser(userEntity),
      accessToken,
      workspaces: workspaceMemberships.map((wm) => ({
        id: wm.workspace.id,
        name: wm.workspace.name,
        slug: wm.workspace.slug,
        role: wm.role,
      })),
    };
  }

  /**
   * Validate user credentials (used by LocalStrategy)
   */
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Get user by ID (for JWT strategy)
   */
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare plain password with hashed password
   */
  private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate JWT access token with workspace context
   */
  /**
   * Switch to a different workspace
   */
  async switchWorkspace(userId: string, workspaceId: string) {
    // Check if user has access to this workspace
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        unique_user_workspace: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
      include: {
        workspace: true,
        user: true,
      },
    });

    if (!membership) {
      throw new UnauthorizedException('You do not have access to this workspace');
    }

    // Transform user to camelCase entity
    const userEntity = membership.user;

    // Generate new JWT with new workspace context
    const accessToken = this.generateToken(userEntity, workspaceId, membership.role);

    return {
      user: UserUtils.toSafeUser(userEntity),
      accessToken,
      workspace: {
        id: membership.workspace.id,
        name: membership.workspace.name,
        slug: membership.workspace.slug,
        role: membership.role,
      },
    };
  }

  private generateToken(
    user: UserEntity,
    workspaceId: string,
    workspaceRole: 'OWNER' | 'ADMIN' | 'MEMBER',
  ): string {
    const payload = {
      sub: user.id,
      email: user.email,
      workspaceId,
      workspaceRole,
    };

    return this.jwtService.sign(payload);
  }
}
