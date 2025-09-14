import { Injectable, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../core/prisma/prisma.service";
import { handlePrismaUniqueError } from "../common/prisma/unique-error.util";
import { logger } from "../common/logger/pino";

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
      include: { reports: { select: { id: true }, take: 1 } },
    });
    if (!u) {
      logger.debug({ userId }, "auth.profile.not_found");
      return null;
    }
    const { password, reports, ...rest } = u as any;
    return {
      ...rest,
      isManager: (reports?.length ?? 0) > 0,
      isAdmin: !!(u as any).isAdmin,
    };
  }
}
