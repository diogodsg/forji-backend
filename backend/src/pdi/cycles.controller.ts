import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OwnerOrManagerGuard } from '../common/guards/owner-or-manager.guard';
import { PdiCyclesService } from './cycles.service';
import { CreatePdiCycleDto, UpdatePdiCycleDto, ChangeStatusDto } from './cycle.dto';

@Controller('pdi/cycles')
@UseGuards(JwtAuthGuard, OwnerOrManagerGuard)
export class PdiCyclesController {
  constructor(private readonly service: PdiCyclesService) {}

  @Get('me')
  listMine(@Req() req: any) { return this.service.list(req.user.id); }

  @Get(':userId')
  list(@Param('userId', ParseIntPipe) userId: number) { return this.service.list(userId); }

  @Post()
  create(@Req() req: any, @Body() body: CreatePdiCycleDto) { return this.service.create(req.user.id, body); }

  @Patch(':id')
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() body: UpdatePdiCycleDto) {
    return this.service.update(id, req.user.id, body);
  }

  @Patch(':id/status')
  changeStatus(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() body: ChangeStatusDto) {
    return this.service.changeStatus(id, req.user.id, body.status);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) { return this.service.remove(id, req.user.id); }
}
