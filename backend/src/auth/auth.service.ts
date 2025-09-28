import { Injectable, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../core/prisma/prisma.service";
import { handlePrismaUniqueError } from "../common/prisma/unique-error.util";
import { logger } from "../common/logger/pino";
import { UpdateProfileDto } from "../dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(email: string, pass: string) {
    const normEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normEmail },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      logger.debug(
        { email: normEmail, userId: user.id },
        "auth.validateUser.success"
      );
      const { password, ...result } = user as any;
      return result;
    }
    logger.debug({ email: normEmail }, "auth.validateUser.fail");
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id?.toString?.() ?? String(user.id),
    };
    const token = this.jwtService.sign(payload);
    logger.info({ userId: user.id, email: user.email }, "auth.login");
    return { access_token: token };
  }

  async register(email: string, password: string, name: string) {
    const hash = await bcrypt.hash(password, 10);
    const userCount = await this.prisma.user.count();
    const normEmail = email.trim().toLowerCase();
    try {
      const user = await this.prisma.user.create({
        data: {
          email: normEmail,
          password: hash,
          name,
          isAdmin: userCount === 0,
        } as any,
      });
      logger.info({ userId: user.id, isAdmin: user.isAdmin }, "auth.register");
      return user;
    } catch (e: any) {
      const mapped = handlePrismaUniqueError(e, {
        email: "Email já está em uso",
      });
      if (mapped) logger.warn({ email: normEmail }, "auth.register.duplicate");
      if (mapped) throw mapped;
      throw e;
    }
  }

  async getProfile(userId: any) {
    const u = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!u) {
      logger.debug({ userId }, "auth.profile.not_found");
      return null;
    }

    // Check if user is a manager by looking at management rules
    const managementRules = await this.prisma.managementRule.findMany({
      where: { managerId: userId },
    });
    const isManager = managementRules.length > 0;

    const { password, ...rest } = u as any;
    return {
      ...rest,
      isManager,
      isAdmin: !!(u as any).isAdmin,
    };
  }

  async updateProfile(userId: any, data: UpdateProfileDto) {
    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.name && { name: data.name.trim() }),
          ...(data.position !== undefined && {
            position: data.position?.trim() || null,
          }),
          ...(data.bio !== undefined && { bio: data.bio?.trim() || null }),
          ...(data.githubId !== undefined && {
            githubId: data.githubId?.trim() || null,
          }),
        } as any,
      });

      logger.info({ userId, updates: Object.keys(data) }, "auth.updateProfile");

      const { password, ...rest } = updated as any;
      return {
        ...rest,
        isManager: false, // Temporarily disabled until relations are fixed
        isAdmin: !!updated.isAdmin,
      };
    } catch (e: any) {
      const mapped = handlePrismaUniqueError(e, {
        githubId: "GitHub ID já está em uso por outro usuário",
      });
      if (mapped) {
        logger.warn(
          { userId, githubId: data.githubId },
          "auth.updateProfile.duplicate"
        );
        throw mapped;
      }
      throw e;
    }
  }

  async changePassword(
    userId: any,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    // Buscar usuário atual para validar senha
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      logger.debug({ userId }, "auth.changePassword.user_not_found");
      return false;
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      logger.warn({ userId }, "auth.changePassword.invalid_current_password");
      return false;
    }

    // Hash da nova senha
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash } as any,
    });

    logger.info({ userId }, "auth.changePassword.success");
    return true;
  }
}
