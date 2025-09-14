import prisma from "../prisma";

export class PermissionService {
  static async isOwnerOrManager(requesterId: number, targetUserId: number) {
    if (requesterId === targetUserId) return true;
    const target = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { managers: { select: { id: true } } },
    });
    if (!target) return false;
    return target.managers.some((m) => String(m.id) === String(requesterId));
  }
}
