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
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthService } from "./auth.service";
import prisma from "./prisma";
import { ParseIntPipe } from "@nestjs/common";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    return !!user?.isAdmin;
  }
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(user);
  }

  @Post("register")
  async register(
    @Body() body: { email: string; password: string; name: string }
  ) {
    const user = await this.authService.register(
      body.email,
      body.password,
      body.name
    );
    return this.authService.login(user);
  }

  // --- Admin endpoints ---
  @Get("users")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async listUsers() {
    const users = (await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        githubId: true,
        createdAt: true,
        updatedAt: true,
        managers: { select: { id: true } },
        reports: { select: { id: true } },
      } as any,
      orderBy: { id: "asc" },
    })) as any[];
    // Append isAdmin from full user read to avoid type mismatch prior to Prisma generate
    const ids = users.map((u) => u.id);
    const full = (await prisma.user.findMany({
      where: { id: { in: ids as any } },
    })) as any[];
    const byId = new Map(full.map((u) => [u.id, u]));
    return users.map((u) => ({
      ...u,
      isAdmin: !!(byId.get(u.id) as any)?.isAdmin,
    }));
  }

  @Post("admin/create-user")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminCreateUser(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      isAdmin?: boolean;
      githubId?: string;
    }
  ) {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash(body.password, 10);
    try {
      const created = await prisma.user.create({
        data: {
          email: body.email,
          password: hash,
          name: body.name,
          // cast to any to allow isAdmin before Prisma client is regenerated
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
      if (e?.code === "P2002") {
        // Determine which unique field
        const target = Array.isArray(e?.meta?.target)
          ? e.meta.target.join(",")
          : "";
        if (target.includes("email")) {
          throw new ConflictException("Email já está em uso");
        }
        if (target.includes("github_id")) {
          throw new ConflictException("githubId já está em uso");
        }
        throw new ConflictException("Violação de unicidade");
      }
      throw e;
    }
  }

  @Post("admin/set-github-id")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetGithubId(
    @Body() body: { userId: number; githubId: string | null }
  ) {
    try {
      const updated = await prisma.user.update({
        where: { id: body.userId },
        data: { githubId: body.githubId?.trim() || null } as any,
        select: { id: true, githubId: true } as any,
      });
      return updated;
    } catch (e: any) {
      if (e?.code === "P2002") {
        throw new ConflictException("githubId já está em uso");
      }
      throw e;
    }
  }

  @Post("admin/delete-user")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminDeleteUser(@Body() body: { userId: number }) {
    // Cascade deletes: remove PDI plan, disconnect manager relations, delete PR ownership references
    // PRs: set ownerUserId null to preserve PR history
    await prisma.pullRequest.updateMany({
      where: { ownerUserId: body.userId },
      data: { ownerUserId: null },
    });
    await prisma.pdiPlan.deleteMany({ where: { userId: body.userId } });
    // Finally delete the user
    await prisma.user.delete({ where: { id: body.userId } });
    return { deleted: true };
  }

  @Post("admin/set-admin")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetAdmin(@Body() body: { userId: number; isAdmin: boolean }) {
    const updated = await prisma.user.update({
      where: { id: body.userId },
      data: { isAdmin: body.isAdmin } as any,
      select: { id: true, isAdmin: true } as any,
    });
    return updated;
  }

  @Post("admin/set-manager")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetManager(@Body() body: { userId: number; managerId: number }) {
    const updated = await prisma.user.update({
      where: { id: body.userId },
      data: { managers: { connect: { id: body.managerId } } },
      select: { id: true, managers: { select: { id: true } } },
    });
    return updated;
  }

  @Post("admin/remove-manager")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminRemoveManager(
    @Body() body: { userId: number; managerId: number }
  ) {
    const updated = await prisma.user.update({
      where: { id: body.userId },
      data: { managers: { disconnect: { id: body.managerId } } },
      select: { id: true, managers: { select: { id: true } } },
    });
    return updated;
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return prisma.user
      .findUnique({
        where: { id: req.user.id },
        include: { reports: { select: { id: true }, take: 1 } },
      })
      .then((u) => {
        if (!u) return null;
        const { password, reports, ...rest } = u as any;
        return {
          ...rest,
          isManager: (reports?.length ?? 0) > 0,
          isAdmin: !!(u as any).isAdmin,
        } as any;
      });
  }

  // Simple admin-lite endpoint to set who manages whom (PDI control)
  // In a real app, restrict this to admins; here, allow self-assign if requester is target's future manager
  @Post("set-manager")
  @UseGuards(JwtAuthGuard)
  async setManager(
    @Req() req: any,
    @Body() body: { userId: number; managerId: number }
  ) {
    // For MVP, allow requester to set themselves as manager of another user
    if (body.managerId !== req.user.id) {
      throw new UnauthorizedException(
        "Only self-assign as manager is allowed in MVP"
      );
    }
    // Connect manager to user via many-to-many relation
    const updated = await prisma.user.update({
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
  async removeManager(
    @Req() req: any,
    @Body() body: { userId: number; managerId: number }
  ) {
    if (body.managerId !== req.user.id) {
      throw new UnauthorizedException(
        "Only self-remove as manager is allowed in MVP"
      );
    }
    const updated = await prisma.user.update({
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

  // List subordinates (reports) for the authenticated manager (MVP)
  @Get("my-reports")
  @UseGuards(JwtAuthGuard)
  async myReports(@Req() req: any) {
    const reports = await prisma.user.findMany({
      where: { managers: { some: { id: req.user.id } } },
      select: { id: true, email: true, name: true },
      orderBy: { name: "asc" },
    });
    return reports;
  }
}
