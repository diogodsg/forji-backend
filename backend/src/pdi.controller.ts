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
  async get(@Param("userId", ParseIntPipe) userId: number) {
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
  replace(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() body: PdiPlanDto
  ) {
    return this.pdiService.upsert(userId, body as RawPlanDto);
  }

  // Partial update (patch) for current user
  @Patch("me")
  patchMe(@Req() req: any, @Body() partial: PartialPdiPlanDto) {
    return this.pdiService.patch(req.user.id, partial as any);
  }

  @Delete(":userId")
  remove(@Param("userId", ParseIntPipe) userId: number) {
    return this.pdiService.delete(userId);
  }
}
