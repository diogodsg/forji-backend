import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import {
  CreateTeamDto,
  UpdateTeamDto,
  AddMemberDto,
  UpdateMemberRoleDto,
} from "../dto/team.dto";

@Controller("teams")
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}

  @Get()
  async list() {
    const data = await this.teams.list(true);
    return data.map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      createdAt: t.createdAt,
      managers: t.memberships.filter((m: any) => m.role === "MANAGER").length,
      members: t.memberships.length,
    }));
  }

  @Get("metrics")
  async metrics() {
    return this.teams.metrics();
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.teams.get(Number(id));
  }

  @Post()
  @UseGuards(new AdminGuard())
  async create(@Body() body: CreateTeamDto, @Req() req: any) {
    return this.teams.create(body, req.user.id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() body: UpdateTeamDto,
    @Req() req: any
  ) {
    return this.teams.update(Number(id), body, req.user.id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: any) {
    return this.teams.delete(Number(id), req.user.id);
  }

  @Post("add-member")
  async addMember(@Body() body: AddMemberDto, @Req() req: any) {
    return this.teams.addMember(
      body.teamId,
      body.userId,
      body.role,
      req.user.id
    );
  }

  @Post("update-member-role")
  async updateMemberRole(@Body() body: UpdateMemberRoleDto, @Req() req: any) {
    return this.teams.updateMemberRole(
      body.teamId,
      body.userId,
      body.role,
      req.user.id
    );
  }

  @Post("remove-member")
  async removeMember(@Body() body: AddMemberDto, @Req() req: any) {
    return this.teams.removeMember(body.teamId, body.userId, req.user.id);
  }
}
