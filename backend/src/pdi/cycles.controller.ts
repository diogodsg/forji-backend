import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PdiCyclesService } from "./cycles.service";
import {
  CreatePdiCycleDto,
  UpdatePdiCycleDto,
  ChangeStatusDto,
} from "./cycle.dto";
import { PermissionService } from "../core/permissions/permission.service";

@Controller("pdi/cycles")
// Apenas autenticação aqui; autorização refinada é feita manualmente para evitar
// confusão entre IDs de ciclo e IDs de usuário que causava 403 indevido.
@UseGuards(JwtAuthGuard)
export class PdiCyclesController {
  constructor(
    private readonly service: PdiCyclesService,
    private readonly permission: PermissionService
  ) {}

  @Get("me")
  listMine(@Req() req: any) {
    return this.service.list(req.user.id);
  }

  // Histórico: obter um ciclo específico do próprio usuário
  @Get("me/:cycleId")
  async getMine(
    @Req() req: any,
    @Param("cycleId", ParseIntPipe) cycleId: number
  ) {
    return this.service.getForUser(cycleId, req.user.id);
  }

  @Get(":userId")
  async list(@Req() req: any, @Param("userId", ParseIntPipe) userId: number) {
    if (req.user.id !== userId) {
      const ok = await this.permission.isOwnerOrManager(req.user.id, userId);
      if (!ok) throw new ForbiddenException();
    }
    return this.service.list(userId);
  }

  // Histórico: obter ciclo específico de outro usuário (se for manager/owner)
  @Get(":userId/:cycleId")
  async getForUser(
    @Req() req: any,
    @Param("userId", ParseIntPipe) userId: number,
    @Param("cycleId", ParseIntPipe) cycleId: number
  ) {
    if (req.user.id !== userId) {
      const ok = await this.permission.isOwnerOrManager(req.user.id, userId);
      if (!ok) throw new ForbiddenException();
    }
    return this.service.getForUser(cycleId, userId);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreatePdiCycleDto) {
    return this.service.create(req.user.id, body);
  }

  @Post(":userId")
  async createForUser(
    @Req() req: any,
    @Param("userId", ParseIntPipe) userId: number,
    @Body() body: CreatePdiCycleDto
  ) {
    if (req.user.id !== userId) {
      const ok = await this.permission.isOwnerOrManager(req.user.id, userId);
      if (!ok) throw new ForbiddenException();
    }
    return this.service.create(userId, body);
  }

  @Patch(":id")
  async update(
    @Req() req: any,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdatePdiCycleDto
  ) {
    return this.service.update(id, req.user.id, body);
  }

  @Patch(":id/status")
  async changeStatus(
    @Req() req: any,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: ChangeStatusDto
  ) {
    return this.service.changeStatus(id, req.user.id, body.status);
  }

  @Delete(":id")
  async remove(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id, req.user.id);
  }
}
