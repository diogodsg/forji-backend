import { Injectable, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import prisma from "../prisma";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const normEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normEmail } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id?.toString?.() ?? String(user.id),
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(email: string, password: string, name: string) {
    const hash = await bcrypt.hash(password, 10);
    const userCount = await prisma.user.count();
    const normEmail = email.trim().toLowerCase();
    try {
      const user = await prisma.user.create({
        data: {
          email: normEmail,
          password: hash,
          name,
          isAdmin: userCount === 0,
        } as any,
      });
      return user;
    } catch (e: any) {
      if (
        e?.code === "P2002" &&
        Array.isArray(e?.meta?.target) &&
        e.meta.target.includes("email")
      ) {
        throw new ConflictException("Email já está em uso");
      }
      throw e;
    }
  }

  async getProfile(userId: any) {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      include: { reports: { select: { id: true }, take: 1 } },
    });
    if (!u) return null;
    const { password, reports, ...rest } = u as any;
    return {
      ...rest,
      isManager: (reports?.length ?? 0) > 0,
      isAdmin: !!(u as any).isAdmin,
    };
  }
}
