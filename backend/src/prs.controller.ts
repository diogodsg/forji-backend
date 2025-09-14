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
  async list(
    @Req() req: any,
    @Query("ownerUserId") ownerUserId?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ) {
    const p = Math.max(1, parseInt(page || "1", 10));
    const ps = Math.min(200, Math.max(1, parseInt(pageSize || "20", 10)));
    if (ownerUserId) {
      const uid = parseInt(ownerUserId, 10);
      if (!Number.isFinite(uid)) throw new ForbiddenException("Invalid userId");
      if (uid !== req.user.id) {
        const isManager = await prisma.user.count({
          where: { id: uid, managers: { some: { id: req.user.id } } },
        });
        if (!isManager) throw new ForbiddenException();
      }
      return this.prsService.list({ ownerUserId: uid, page: p, pageSize: ps });
    }
    return this.prsService.list({ page: p, pageSize: ps });
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
