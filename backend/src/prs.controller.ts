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
} from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PrsService } from "./prs.service";

@Controller("prs")
@UseGuards(JwtAuthGuard)
export class PrsController {
  constructor(private readonly prsService: PrsService) {}

  @Get()
  list() {
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
