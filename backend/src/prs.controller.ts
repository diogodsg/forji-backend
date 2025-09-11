import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PrsService } from "./prs.service";
import prisma from "./prisma";

@Controller("prs")
@UseGuards(JwtAuthGuard)
export class PrsController {
  constructor(private readonly prsService: PrsService) {}

  @Get()
  async list(@Req() req: any, @Query("ownerUserId") ownerUserId?: string) {
    if (ownerUserId) {
      const uid = parseInt(ownerUserId, 10);
      if (!Number.isFinite(uid)) throw new ForbiddenException("Invalid userId");
      if (uid !== req.user.id) {
        const isManager = await prisma.user.count({
          where: { id: uid, managers: { some: { id: req.user.id } } },
        });
        if (!isManager) throw new ForbiddenException();
      }
      return this.prsService.list({ ownerUserId: uid });
    }
    return this.prsService.list();
  }

  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.prsService.get(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.prsService.create(body);
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: any) {
    return this.prsService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prsService.remove(id);
  }
}
