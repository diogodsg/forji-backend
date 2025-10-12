import { Module } from "@nestjs/common";
import { PdiController } from "./pdi.controller";
import { PdiService } from "./pdi.service";
import { PdiCyclesController } from "./cycles.controller";
import { PdiCyclesService } from "./cycles.service";
import { PermissionsModule } from "../core/permissions/permissions.module";
import { AuthModule } from "../auth/auth.module";
import { GamificationModule } from "../gamification/gamification.module";
import { OwnerOrManagerGuard } from "../common/guards/owner-or-manager.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@Module({
  imports: [PermissionsModule, AuthModule, GamificationModule],
  controllers: [PdiController, PdiCyclesController],
  providers: [PdiService, PdiCyclesService, OwnerOrManagerGuard, JwtAuthGuard],
  exports: [PdiService, PdiCyclesService],
})
export class PdiModule {}
