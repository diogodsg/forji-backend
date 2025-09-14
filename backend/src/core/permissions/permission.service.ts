import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async isOwnerOrManager(requesterId: number, targetUserId: number) {
    if (requesterId === targetUserId) return true;
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { managers: { select: { id: true } } },
    });
    if (!target) return false;
    return target.managers.some((m) => String(m.id) === String(requesterId));
  }
}
