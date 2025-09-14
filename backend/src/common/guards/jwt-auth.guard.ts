import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../core/prisma/prisma.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers["authorization"];
    if (!authHeader) return false;
    const token = authHeader.split(" ")[1];
    try {
      const payload = this.jwtService.verify(token);
      const rawSub = payload.sub;
      let userId: any = rawSub;
      if (typeof rawSub === "string" && /^\d+$/.test(rawSub)) {
        try {
          userId = BigInt(rawSub);
        } catch {
          userId = Number(rawSub);
        }
      }
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) return false;
      req.user = user;
      return true;
    } catch {
      return false;
    }
  }
}
