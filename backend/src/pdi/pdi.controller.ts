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
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { OwnerOrManagerGuard } from "../common/guards/owner-or-manager.guard";
import {
  PdiPlanDto,
  PdiService,
  PdiPlanDto as RawPlanDto,
} from "./pdi.service";
import { PartialPdiPlanDto } from "./pdi.dto";

@Controller("pdi")
@UseGuards(JwtAuthGuard, OwnerOrManagerGuard)
export class PdiController {
  constructor(private readonly pdiService: PdiService) {}
  @Get("me")
  async me(@Req() req: any) {
    const plan = await this.pdiService.getByUser(req.user.id);
    if (!plan) throw new NotFoundException();
    return plan;
  }
  @Get(":userId")
  async get(@Req() req: any, @Param("userId", ParseIntPipe) userId: number) {
    const plan = await this.pdiService.getByUser(userId);
    if (!plan) throw new NotFoundException();
    return plan;
  }
  @Post()
  upsert(@Req() req: any, @Body() body: PdiPlanDto) {
    return this.pdiService.upsert(req.user.id, body as RawPlanDto);
  }
  @Put(":userId")
  async replace(
    @Req() req: any,
    @Param("userId", ParseIntPipe) userId: number,
    @Body() body: PdiPlanDto
  ) {
    return this.pdiService.upsert(userId, body as RawPlanDto);
  }
  @Patch("me")
  patchMe(@Req() req: any, @Body() partial: PartialPdiPlanDto) {
    return this.pdiService.patch(req.user.id, partial as any);
  }
  @Delete(":userId")
  async remove(@Req() req: any, @Param("userId", ParseIntPipe) userId: number) {
    return this.pdiService.delete(userId);
  }
}
