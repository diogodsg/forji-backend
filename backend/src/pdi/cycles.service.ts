import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { SoftDeleteService } from "../common/prisma/soft-delete.extension";
import { logger } from "../common/logger/pino";
import { PdiCycleStatusDto } from "./cycles.dto";

interface CycleQueryOptions {
  status?: PdiCycleStatusDto;
  activeOnly?: boolean; // convenience filter for current date window
}

@Injectable()
export class PdiCyclesService extends SoftDeleteService {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async listForUser(userId: number, opts: CycleQueryOptions = {}) {
    const where: any = this.addSoftDeleteFilter({ userId });
    if (opts.status) where.status = opts.status;
    if (opts.activeOnly) {
      const now = new Date();
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    }
    return this.prisma.pdiCycle.findMany({
      where,
      orderBy: { startDate: "desc" },
    });
  }

  async get(userId: number, id: number) {
    const cycle = await this.prisma.pdiCycle.findFirst({
      where: this.addSoftDeleteFilter({ id: BigInt(id), userId }),
    });
    if (!cycle) throw new NotFoundException("Cycle not found");
    return cycle;
  }

  async create(userId: number, data: any) {
    // NOTE: After running `npx prisma generate`, replace any casts with proper types
    const created = await (this.prisma as any).pdiCycle.create({
      data: {
        userId: BigInt(userId),
        title: data.title,
        description: data.description,
        status: (data.status as any) ?? "PLANNED",
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        competencies: data.competencies || [],
        milestones: data.milestones || [],
        krs: data.krs || [],
        records: data.records || [],
      },
    });
    logger.info(
      { msg: "pdi.cycle.create", userId, cycleId: created.id, status: created.status },
      "pdi.cycle.create userId=%d id=%d",
      userId,
      Number(created.id)
    );
    return created;
  }

  async update(userId: number, id: number, patch: any) {
    const existing = await this.get(userId, id);
    const updated = await (this.prisma as any).pdiCycle.update({
      where: { id: existing.id },
      data: {
        title: patch.title ?? existing.title,
        description: patch.description ?? existing.description,
        status: (patch.status as any) ?? existing.status,
        startDate: patch.startDate ? new Date(patch.startDate) : existing.startDate,
        endDate: patch.endDate ? new Date(patch.endDate) : existing.endDate,
        competencies: patch.competencies ?? (existing.competencies as any),
        milestones: patch.milestones ?? (existing.milestones as any),
        krs: patch.krs ?? (existing.krs as any),
        records: patch.records ?? (existing.records as any),
      },
    });
    logger.info(
      { msg: "pdi.cycle.update", userId, cycleId: id, status: updated.status },
      "pdi.cycle.update userId=%d id=%d",
      userId,
      id
    );
    return updated;
  }

  async softDeleteCycle(userId: number, id: number) {
    const existing = await this.get(userId, id);
  await this.softDelete("pdiCycle", existing.id as any);
    logger.warn(
      { msg: "pdi.cycle.softDelete", userId, cycleId: id },
      "pdi.cycle.softDelete userId=%d id=%d",
      userId,
      id
    );
    return { deleted: true };
  }
}
