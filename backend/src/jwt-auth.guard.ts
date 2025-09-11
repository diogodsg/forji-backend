import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import prisma from "./prisma";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers["authorization"];
    if (!authHeader) return false;
    const token = authHeader.split(" ")[1];
    try {
      const payload = this.jwtService.verify(token);
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return false;
      req.user = user;
      return true;
    } catch {
      return false;
    }
  }
}
