import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Post,
  Patch,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { NotFoundException } from "@nestjs/common";
import { PdiService, PdiPlanDto as RawPlanDto } from "./pdi.service";
import prisma from "./prisma";
import { ForbiddenException } from "@nestjs/common";
import { PdiPlanDto, PartialPdiPlanDto } from "./pdi.dto";

@Controller("pdi")
@UseGuards(JwtAuthGuard)
export class PdiController {
  constructor(private readonly pdiService: PdiService) {}

  // Get current user's plan
  @Get("me")
  async me(@Req() req: any) {
    const plan = await this.pdiService.getByUser(req.user.id);
    if (!plan) throw new NotFoundException();
    return plan;
  }

  // Get another user's plan (could add role checks later)
  @Get(":userId")
  async get(@Req() req: any, @Param("userId", ParseIntPipe) userId: number) {
    await this.ensureOwnerOrManager(req.user.id, userId);
    const plan = await this.pdiService.getByUser(userId);
    if (!plan) throw new NotFoundException();
    return plan;
  }

  // Create or fully replace plan for current user
  @Post()
  upsert(@Req() req: any, @Body() body: PdiPlanDto) {
    return this.pdiService.upsert(req.user.id, body as RawPlanDto);
  }

  // Full update by explicit userId (admin / future role check)
  @Put(":userId")
  async replace(
    @Req() req: any,
    @Param("userId", ParseIntPipe) userId: number,
    @Body() body: PdiPlanDto
  ) {
    await this.ensureOwnerOrManager(req.user.id, userId);
    return this.pdiService.upsert(userId, body as RawPlanDto);
  }

  // Partial update (patch) for current user
  @Patch("me")
  patchMe(@Req() req: any, @Body() partial: PartialPdiPlanDto) {
    return this.pdiService.patch(req.user.id, partial as any);
  }

  @Delete(":userId")
  async remove(@Req() req: any, @Param("userId", ParseIntPipe) userId: number) {
    await this.ensureOwnerOrManager(req.user.id, userId);
    return this.pdiService.delete(userId);
  }

  private async ensureOwnerOrManager(
    requesterId: number,
    targetUserId: number
  ) {
    if (requesterId === targetUserId) return;
    const target = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { managers: { select: { id: true } } },
    });
    if (!target) throw new NotFoundException("User not found");
    // Normalize to string to safely compare bigint/number IDs
    const requesterIdStr = String(requesterId);
    const isManager = target.managers?.some(
      (m) => String(m.id) === requesterIdStr
    );
    if (!isManager) {
      throw new ForbiddenException("Not allowed to access this user's PDI");
    }
  }
}
