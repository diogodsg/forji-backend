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
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { OwnerOrManagerGuard } from "../common/guards/owner-or-manager.guard";
import { PrsService } from "./prs.service";
import { UpsertPullRequestDto } from "../dto/pr.dto";

@Controller("prs")
@UseGuards(JwtAuthGuard, OwnerOrManagerGuard)
export class PrsController {
  constructor(private readonly prsService: PrsService) {}

  @Get()
  async list(
    @Req() req: any,
    @Query("ownerUserId") ownerUserId?: string,
    @Query("repo") repo?: string,
    @Query("state") state?: string,
    @Query("author") author?: string,
    @Query("q") q?: string,
    @Query("sort") sort?: string,
    @Query("meta") meta?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ) {
    const p = Math.max(1, parseInt(page || "1", 10));
    const ps = Math.min(200, Math.max(1, parseInt(pageSize || "20", 10)));
    if (ownerUserId) {
      const uid = parseInt(ownerUserId, 10);
      if (!Number.isFinite(uid)) throw new ForbiddenException("Invalid userId");
      // Guard OwnerOrManager cuida de permissões; se chegou aqui está autorizado
      return this.prsService.list({
        ownerUserId: uid,
        repo: repo || undefined,
        state: state || undefined,
        author: author || undefined,
        q: q || undefined,
        sort: sort || undefined,
        page: p,
        pageSize: ps,
        includeMeta: meta === "1" || meta === "true",
      });
    }
    return this.prsService.list({
      repo: repo || undefined,
      state: state || undefined,
      author: author || undefined,
      q: q || undefined,
      sort: sort || undefined,
      page: p,
      pageSize: ps,
      includeMeta: meta === "1" || meta === "true",
    });
  }

  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.prsService.get(id);
  }
  @Post()
  create(@Body() body: UpsertPullRequestDto) {
    return this.prsService.create(body);
  }
  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpsertPullRequestDto
  ) {
    return this.prsService.update(id, body);
  }
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.prsService.remove(id);
  }
}
