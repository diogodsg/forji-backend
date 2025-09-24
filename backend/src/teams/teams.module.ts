import { Module } from "@nestjs/common";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";
import { PermissionsModule } from "../core/permissions/permissions.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PermissionsModule, AuthModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
