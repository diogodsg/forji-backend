import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { SoftDeleteService } from "../common/prisma/soft-delete.extension";
import { Prisma, PdiCycleStatus } from "@prisma/client";
import { CreatePdiCycleDto, UpdatePdiCycleDto } from "./cycle.dto";
import { PermissionService } from "../core/permissions/permission.service";

@Injectable()
export class PdiCyclesService extends SoftDeleteService {
  constructor(prisma: PrismaService, private permission: PermissionService) {
    super(prisma);
  }

  async list(userId: number) {
    return (this.prisma as any).pdiCycle.findMany({
      where: this.addSoftDeleteFilter({ userId }),
      orderBy: { startDate: "desc" },
    });
  }

  async getForUser(id: number, userId: number) {
    const cycle = await (this.prisma as any).pdiCycle.findFirst({
      where: this.addSoftDeleteFilter({ id, userId }),
    });
    if (!cycle) throw new NotFoundException("Cycle not found");
    return cycle;
  }

  private async findCycle(id: number) {
    const cycle = await (this.prisma as any).pdiCycle.findFirst({
      where: this.addSoftDeleteFilter({ id }),
    });
    if (!cycle) throw new NotFoundException("Cycle not found");
    return cycle;
  }

  async create(userId: number, dto: CreatePdiCycleDto) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start)
      throw new BadRequestException("endDate must be after startDate");

    // Garantir 1 ACTIVE por user
    const active = await this.prisma.pdiCycle.findFirst({
      where: { userId, status: PdiCycleStatus.ACTIVE, deleted_at: null },
    });
    const status = active ? PdiCycleStatus.PLANNED : PdiCycleStatus.ACTIVE;

    return this.prisma.pdiCycle.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        startDate: start,
        endDate: end,
        status,
        competencies: dto.competencies ?? [],
        krs: dto.krs as any,
        milestones: dto.milestones as any,
        records: dto.records as any,
      },
    });
  }

  async update(id: number, requesterId: number, dto: UpdatePdiCycleDto) {
    const existing = await this.findCycle(id);
    if (existing.userId !== requesterId) {
      const ok = await this.permission.isOwnerOrManager(
        requesterId,
        Number(existing.userId)
      );
      if (!ok) throw new ForbiddenException();
    }

    if (dto.startDate || dto.endDate) {
      const start = new Date(dto.startDate ?? existing.startDate);
      const end = new Date(dto.endDate ?? existing.endDate);
      if (end <= start)
        throw new BadRequestException("endDate must be after startDate");
    }
    if (dto.status && dto.status !== existing.status) {
      if (dto.status === "ACTIVE") {
        const other = await this.prisma.pdiCycle.findFirst({
          where: {
            userId: existing.userId,
            status: PdiCycleStatus.ACTIVE,
            id: { not: id },
            deleted_at: null,
          },
        });
        if (other) throw new BadRequestException("Another ACTIVE cycle exists");
      }
    }
    return this.prisma.pdiCycle.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        description: dto.description ?? existing.description,
        startDate: dto.startDate ? new Date(dto.startDate) : existing.startDate,
        endDate: dto.endDate ? new Date(dto.endDate) : existing.endDate,
        status: dto.status ?? existing.status,
        competencies: dto.competencies ?? existing.competencies,
        krs: dto.krs !== undefined ? (dto.krs as any) : existing.krs,
        milestones:
          dto.milestones !== undefined
            ? (dto.milestones as any)
            : existing.milestones,
        records:
          dto.records !== undefined ? (dto.records as any) : existing.records,
        progressMeta:
          dto.progressMeta !== undefined
            ? (dto.progressMeta as any)
            : existing.progressMeta,
      },
    });
  }

  async changeStatus(id: number, requesterId: number, status: PdiCycleStatus) {
    const existing = await this.findCycle(id);
    if (existing.userId !== requesterId) {
      const ok = await this.permission.isOwnerOrManager(
        requesterId,
        Number(existing.userId)
      );
      if (!ok) throw new ForbiddenException();
    }
    if (status === PdiCycleStatus.ACTIVE) {
      const other = await this.prisma.pdiCycle.findFirst({
        where: {
          userId: existing.userId,
          status: PdiCycleStatus.ACTIVE,
          id: { not: id },
          deleted_at: null,
        },
      });
      if (other) throw new BadRequestException("Another ACTIVE cycle exists");
    }
    // Snapshot / sync logic:
    // 1. If activating a cycle, copy current plan content into it so the active cycle reflects latest plan.
    // 2. If completing an ACTIVE cycle, ensure we freeze the final state (copy again in case plan changed moments before status change).
    // 3. If completing a non-active (edge case) cycle that has no content, attempt to hydrate from plan.
    let data: any = { status };
    try {
      const plan = await (this.prisma as any).pdiPlan.findFirst({
        where: { userId: existing.userId, deleted_at: null },
      });
      if (plan) {
        const needsCopyOnActivate =
          status === PdiCycleStatus.ACTIVE &&
          existing.status !== PdiCycleStatus.ACTIVE;
        const completing =
          status === PdiCycleStatus.COMPLETED &&
          existing.status !== PdiCycleStatus.COMPLETED;
        const wasActiveAndCompleting =
          completing && existing.status === PdiCycleStatus.ACTIVE;
        const emptyContent =
          (existing.competencies?.length ?? 0) === 0 &&
          (!Array.isArray(existing.milestones) ||
            (existing.milestones as any[]).length === 0) &&
          (!Array.isArray(existing.krs) ||
            (existing.krs as any[]).length === 0) &&
          (!Array.isArray(existing.records) ||
            (existing.records as any[]).length === 0);

        if (
          needsCopyOnActivate ||
          wasActiveAndCompleting ||
          (completing && emptyContent)
        ) {
          data = {
            ...data,
            competencies: plan.competencies ?? [],
            milestones: plan.milestones ?? [],
            krs: plan.krs ?? [],
            records: plan.records ?? [],
          };
        }
      }
    } catch (e) {
      // Falha em snapshot não deve impedir mudança de status; logaria em um logger real
    }
    return this.prisma.pdiCycle.update({ where: { id }, data });
  }

  async remove(id: number, requesterId: number) {
    const existing = await this.findCycle(id);
    if (existing.userId !== requesterId) {
      const ok = await this.permission.isOwnerOrManager(
        requesterId,
        Number(existing.userId)
      );
      if (!ok) throw new ForbiddenException();
    }
    await this.softDelete("pdiCycle", existing.id);
    return { deleted: true };
  }
}
