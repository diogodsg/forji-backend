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
import prisma from "../prisma";
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
  constructor(private readonly authService: AuthService) {}

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
    const users = await prisma.user.findMany({
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
      const created = await prisma.user.create({
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
      if (e?.code === "P2002") {
        const target = Array.isArray(e?.meta?.target)
          ? e.meta.target.join(",")
          : "";
        if (target.includes("email"))
          throw new ConflictException("Email já está em uso");
        if (target.includes("github_id"))
          throw new ConflictException("githubId já está em uso");
        throw new ConflictException("Violação de unicidade");
      }
      throw e;
    }
  }

  @Post("admin/set-github-id")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetGithubId(@Body() body: SetGithubIdDto) {
    try {
      const updated = await prisma.user.update({
        where: { id: body.userId },
        data: { githubId: body.githubId?.trim() || null } as any,
        select: { id: true, githubId: true } as any,
      });
      return updated;
    } catch (e: any) {
      if (e?.code === "P2002")
        throw new ConflictException("githubId já está em uso");
      throw e;
    }
  }

  @Post("admin/delete-user")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminDeleteUser(@Body() body: DeleteUserDto) {
    // Execute as transaction for consistency
    await prisma.$transaction([
      prisma.pullRequest.updateMany({
        where: { ownerUserId: body.userId },
        data: { ownerUserId: null },
      }),
      prisma.pdiPlan.deleteMany({ where: { userId: body.userId } }),
      prisma.user.delete({ where: { id: body.userId } }),
    ]);
    return { deleted: true };
  }

  @Post("admin/set-admin")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetAdmin(@Body() body: SetAdminDto) {
    const updated = await prisma.user.update({
      where: { id: body.userId },
      data: { isAdmin: body.isAdmin } as any,
      select: { id: true, isAdmin: true } as any,
    });
    return updated;
  }

  @Post("admin/set-manager")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetManager(@Body() body: RelationDto) {
    const updated = await prisma.user.update({
      where: { id: body.userId },
      data: { managers: { connect: { id: body.managerId } } },
      select: { id: true, managers: { select: { id: true } } },
    });
    return updated;
  }

  @Post("admin/remove-manager")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminRemoveManager(@Body() body: RelationDto) {
    const updated = await prisma.user.update({
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
  async removeManager(@Req() req: any, @Body() body: RelationDto) {
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

  @Get("my-reports")
  @UseGuards(JwtAuthGuard)
  async myReports(@Req() req: any) {
    return prisma.user.findMany({
      where: { managers: { some: { id: req.user.id } } },
      select: { id: true, email: true, name: true },
      orderBy: { name: "asc" },
    });
  }
}
