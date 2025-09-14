import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import prisma from "./prisma";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const normEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normEmail } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // JWT cannot serialize BigInt directly; use string for sub
    const payload = {
      email: user.email,
      sub: user.id?.toString?.() ?? String(user.id),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
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
          // first user becomes admin to bootstrap access management
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
        // Surface a 409 Conflict for duplicate emails
        const { ConflictException } = await import("@nestjs/common");
        throw new ConflictException("Email já está em uso");
      }
      throw e;
    }
  }
}
