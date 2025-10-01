import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { OwnerOrManagerGuard } from "../common/guards/owner-or-manager.guard";
import { PdiCyclesService } from "./cycles.service";
import { CreatePdiCycleDto, UpdatePdiCycleDto, PdiCycleStatusDto } from "./cycles.dto";

@Controller("pdi/cycles")
@UseGuards(JwtAuthGuard, OwnerOrManagerGuard)
export class PdiCyclesController {
  constructor(private readonly cycles: PdiCyclesService) {}

  @Get("me")
  listMine(
    @Req() req: any,
    @Query("status") status?: PdiCycleStatusDto,
    @Query("activeOnly") activeOnly?: string
  ) {
    return this.cycles.listForUser(req.user.id, {
      status,
      activeOnly: activeOnly === "true",
    });
  }

  @Get(":userId")
  listForUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Query("status") status?: PdiCycleStatusDto,
    @Query("activeOnly") activeOnly?: string
  ) {
    return this.cycles.listForUser(userId, {
      status,
      activeOnly: activeOnly === "true",
    });
  }

  @Get(":userId/:id")
  getOne(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.cycles.get(userId, id);
  }

  @Post("me")
  createMine(@Req() req: any, @Body() body: CreatePdiCycleDto) {
    return this.cycles.create(req.user.id, body);
  }

  @Post(":userId")
  createForUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() body: CreatePdiCycleDto
  ) {
    return this.cycles.create(userId, body);
  }

  @Patch(":userId/:id")
  update(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("id", ParseIntPipe) id: number,
    @Body() patch: UpdatePdiCycleDto
  ) {
    return this.cycles.update(userId, id, patch);
  }

  @Delete(":userId/:id")
  remove(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.cycles.softDeleteCycle(userId, id);
  }
}
