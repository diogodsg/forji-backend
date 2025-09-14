import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { handlePrismaUniqueError } from "../common/prisma/unique-error.util";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import {
  LoginDto,
  RegisterDto,
  AdminCreateUserDto,
  SetGithubIdDto,
  DeleteUserDto,
  SetAdminDto,
  RelationDto,
  UserProfileDto,
} from "../dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Post("login")
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    return this.authService.login(user);
  }

  @Post("register")
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(
      body.email,
      body.password,
      body.name
    );
    return this.authService.login(user);
  }

  @Get("users")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async listUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        githubId: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        managers: { select: { id: true } },
        reports: { select: { id: true } },
      },
      orderBy: { id: "asc" },
    });
    return users.map((u) => ({ ...u, isAdmin: !!u.isAdmin }));
  }

  @Post("admin/create-user")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminCreateUser(@Body() body: AdminCreateUserDto) {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash(body.password, 10);
    try {
      const created = await this.prisma.user.create({
        data: {
          email: body.email,
          password: hash,
          name: body.name,
          isAdmin: !!body.isAdmin,
          githubId: body.githubId?.trim() || undefined,
        } as any,
        select: {
          id: true,
          email: true,
          name: true,
          githubId: true,
          createdAt: true,
        } as any,
      });
      return { ...created, isAdmin: !!body.isAdmin } as any;
    } catch (e: any) {
      const mapped = handlePrismaUniqueError(e, {
        email: "Email já está em uso",
        github_id: "githubId já está em uso",
      });
      if (mapped) throw mapped;
      throw e;
    }
  }

  @Post("admin/set-github-id")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetGithubId(@Body() body: SetGithubIdDto) {
    try {
      const updated = await this.prisma.user.update({
        where: { id: body.userId },
        data: { githubId: body.githubId?.trim() || null } as any,
        select: { id: true, githubId: true } as any,
      });
      return updated;
    } catch (e: any) {
      const mapped = handlePrismaUniqueError(e, {
        github_id: "githubId já está em uso",
      });
      if (mapped) throw mapped;
      throw e;
    }
  }

  @Post("admin/delete-user")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminDeleteUser(@Body() body: DeleteUserDto) {
    // Execute as transaction for consistency
    await this.prisma.$transaction([
      this.prisma.pullRequest.updateMany({
        where: { ownerUserId: body.userId },
        data: { ownerUserId: null },
      }),
      this.prisma.pdiPlan.deleteMany({ where: { userId: body.userId } }),
      this.prisma.user.delete({ where: { id: body.userId } }),
    ]);
    return { deleted: true };
  }

  @Post("admin/set-admin")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetAdmin(@Body() body: SetAdminDto) {
    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { isAdmin: body.isAdmin } as any,
      select: { id: true, isAdmin: true } as any,
    });
    return updated;
  }

  @Post("admin/set-manager")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetManager(@Body() body: RelationDto) {
    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { managers: { connect: { id: body.managerId } } },
      select: { id: true, managers: { select: { id: true } } },
    });
    return updated;
  }

  @Post("admin/remove-manager")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminRemoveManager(@Body() body: RelationDto) {
    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { managers: { disconnect: { id: body.managerId } } },
      select: { id: true, managers: { select: { id: true } } },
    });
    return updated;
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any): Promise<UserProfileDto | null> {
    return this.authService.getProfile(req.user.id);
  }

  @Post("set-manager")
  @UseGuards(JwtAuthGuard)
  async setManager(@Req() req: any, @Body() body: RelationDto) {
    if (body.managerId !== req.user.id) {
      throw new UnauthorizedException(
        "Only self-assign as manager is allowed in MVP"
      );
    }
    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { managers: { connect: { id: body.managerId } } },
      select: {
        id: true,
        email: true,
        name: true,
        managers: { select: { id: true } },
      },
    });
    return updated;
  }

  @Post("remove-manager")
  @UseGuards(JwtAuthGuard)
  async removeManager(@Req() req: any, @Body() body: RelationDto) {
    if (body.managerId !== req.user.id) {
      throw new UnauthorizedException(
        "Only self-remove as manager is allowed in MVP"
      );
    }
    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { managers: { disconnect: { id: body.managerId } } },
      select: {
        id: true,
        email: true,
        name: true,
        managers: { select: { id: true } },
      },
    });
    return updated;
  }

  @Get("my-reports")
  @UseGuards(JwtAuthGuard)
  async myReports(@Req() req: any) {
    return this.prisma.user.findMany({
      where: { managers: { some: { id: req.user.id } } },
      select: { id: true, email: true, name: true },
      orderBy: { name: "asc" },
    });
  }

  @Get("my-reports/summary")
  @UseGuards(JwtAuthGuard)
  async myReportsSummary(@Req() req: any) {
    // Buscar usuários reportados
    const reports = await this.prisma.user.findMany({
      where: { managers: { some: { id: req.user.id } } },
      select: { id: true, email: true, name: true },
      orderBy: { name: "asc" },
    });
    if (reports.length === 0) {
      return {
        reports: [],
        metrics: {
          totalReports: 0,
          prs: { open: 0, merged: 0, closed: 0 },
          pdiActive: 0,
          avgPdiProgress: 0,
        },
      };
    }
    const userIds = reports.map((r) => r.id);
    // PRs por ownerUserId (diretamente atribuídos)
    const prs = await this.prisma.pullRequest.findMany({
      where: { ownerUserId: { in: userIds } },
      select: {
        id: true,
        ownerUserId: true,
        state: true,
        createdAt: true,
        updatedAt: true,
        mergedAt: true,
      },
    });
    // Planos PDI
    const pdis = await this.prisma.pdiPlan.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        updatedAt: true,
        milestones: true,
        records: true,
      },
    });

    // Mapear progresso de PDI: heurística simples (contagem de milestones concluídas / total) se estrutura permitir; fallback 0.
    const pdiMap = new Map<bigint, { progress: number; updatedAt?: Date }>();
    for (const p of pdis) {
      let progress = 0;
      try {
        const milestones: any[] = Array.isArray(p.milestones)
          ? (p.milestones as any[])
          : [];
        if (milestones.length) {
          const total = milestones.length;
          const done = milestones.filter(
            (m: any) => m?.done || m?.status === "done"
          ).length;
          progress = total ? done / total : 0;
        } else if (Array.isArray(p.records) && (p.records as any[]).length) {
          progress = Math.min(1, (p.records as any[]).length / 10);
        }
      } catch {
        progress = 0;
      }
      pdiMap.set(p.userId, { progress, updatedAt: p.updatedAt });
    }

    // Agregar PRs
    const prStateMap = new Map<
      bigint,
      {
        open: number;
        merged: number;
        closed: number;
        lastActivity?: Date;
        leadTimeSumMs: number;
        mergedCount: number;
      }
    >();
    for (const pr of prs) {
      if (!pr.ownerUserId) continue; // segurança
      const entry = prStateMap.get(pr.ownerUserId) || {
        open: 0,
        merged: 0,
        closed: 0,
        lastActivity: undefined as Date | undefined,
        leadTimeSumMs: 0,
        mergedCount: 0,
      };
      if (pr.state === "open") entry.open++;
      else if (pr.state === "closed") entry.closed++;
      else if (pr.state === "merged") {
        entry.merged++;
        if (pr.mergedAt && pr.createdAt) {
          entry.mergedCount++;
          entry.leadTimeSumMs += pr.mergedAt.getTime() - pr.createdAt.getTime();
        }
      }
      const act = pr.updatedAt || pr.createdAt || undefined;
      if (act && (!entry.lastActivity || act > entry.lastActivity))
        entry.lastActivity = act;
      prStateMap.set(pr.ownerUserId, entry);
    }

    // Construir resposta por usuário
    const reportSummaries = reports.map((r) => {
      const bigintId = BigInt(r.id);
      const prAgg = prStateMap.get(bigintId) || {
        open: 0,
        merged: 0,
        closed: 0,
        lastActivity: undefined,
        leadTimeSumMs: 0,
        mergedCount: 0,
      };
      const pdi = pdiMap.get(bigintId);
      return {
        userId: r.id,
        name: r.name,
        email: r.email,
        pdi: {
          exists: !!pdi,
          progress: pdi?.progress ?? 0,
          updatedAt: pdi?.updatedAt?.toISOString(),
        },
        prs: {
          open: prAgg.open,
          merged: prAgg.merged,
          closed: prAgg.closed,
          lastActivity: prAgg.lastActivity?.toISOString(),
        },
      };
    });

    // Métricas globais
    let totalOpen = 0,
      totalMerged = 0,
      totalClosed = 0;
    let leadTimeSumMs = 0,
      mergedCount = 0;
    let pdiActive = 0,
      pdiProgressSum = 0;
    for (const s of reportSummaries) {
      totalOpen += s.prs.open;
      totalMerged += s.prs.merged;
      totalClosed += s.prs.closed;
      const prAgg = prStateMap.get(BigInt(s.userId));
      if (prAgg) {
        leadTimeSumMs += prAgg.leadTimeSumMs;
        mergedCount += prAgg.mergedCount;
      }
      if (s.pdi.exists) {
        pdiActive++;
        pdiProgressSum += s.pdi.progress;
      }
    }
    const avgPdiProgress = pdiActive ? pdiProgressSum / pdiActive : 0;
    const leadTimeAvgDays = mergedCount
      ? leadTimeSumMs / mergedCount / 1000 / 60 / 60 / 24
      : undefined;
    // Velocity simples: merged / número de devs (últimos 30d não filtrado ainda) -> melhoria futura adicionar filtro tempo
    const velocityPerDevWeek = reports.length
      ? totalMerged / reports.length / 4
      : undefined;

    return {
      reports: reportSummaries,
      metrics: {
        totalReports: reports.length,
        prs: { open: totalOpen, merged: totalMerged, closed: totalClosed },
        pdiActive,
        avgPdiProgress,
        velocityPerDevWeek,
        leadTimeAvgDays,
      },
    };
  }
}
