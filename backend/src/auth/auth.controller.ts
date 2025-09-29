import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  Get,
  Req,
  Patch,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import {
  LoginDto,
  RegisterDto,
  AdminCreateUserDto,
  SetGithubIdDto,
  SetAdminDto,
  RelationDto,
  UserProfileDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from "../dto/auth.dto";
import { PrismaService } from "../core/prisma/prisma.service";

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
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        githubId: true,
        isAdmin: true,
        position: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: "asc" },
    });

    // For now, return with empty managers and reports arrays
    // This can be fixed later when the relationship issue is resolved
    return users.map((user) => ({
      ...user,
      managers: [],
      reports: [],
    }));
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
          isAdmin: body.isAdmin || false,
          githubId: body.githubId || null,
        },
      });
      return { id: created.id };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new BadRequestException("Email já está em uso");
      }
      throw error;
    }
  }

  @Post("admin/delete-user")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminDeleteUser(@Body() body: { userId: bigint }) {
    // Soft delete do usuário
    await this.prisma.user.update({
      where: { id: body.userId },
      data: { deletedAt: new Date() }
    });
    return { success: true };
  }

  @Post("admin/restore-user")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminRestoreUser(@Body() body: { userId: bigint }) {
    // Restaurar usuário soft deleted
    await this.prisma.user.update({
      where: { id: body.userId },
      data: { deletedAt: null }
    });
    return { success: true };
  }

  @Post("admin/hard-delete-user")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminHardDeleteUser(@Body() body: { userId: bigint }) {
    // Hard delete permanente (apenas para casos extremos)
    await this.prisma.user.delete({
      where: { id: body.userId },
    });
    return { success: true };
  }

  @Post("admin/set-github-id")
  @UseGuards(JwtAuthGuard, new AdminGuard())
  async adminSetGithubId(@Body() body: SetGithubIdDto) {
    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { githubId: body.githubId },
      select: { id: true, githubId: true },
    });
    return updated;
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

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any): Promise<UserProfileDto | null> {
    return this.authService.getProfile(req.user.id);
  }

  @Patch("profile")
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: any,
    @Body() body: UpdateProfileDto
  ): Promise<UserProfileDto> {
    return this.authService.updateProfile(req.user.id, body);
  }

  @Patch("change-password")
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: any,
    @Body() body: ChangePasswordDto
  ): Promise<{ success: boolean }> {
    const success = await this.authService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword
    );
    if (!success) {
      throw new BadRequestException("Senha atual incorreta");
    }
    return { success: true };
  }
}
