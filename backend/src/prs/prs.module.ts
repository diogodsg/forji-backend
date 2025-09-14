import { Module } from "@nestjs/common";
import { PrsController } from "./prs.controller";
import { PrsService } from "./prs.service";
import { PrsMetricsController } from "./prs-metrics.controller";
import { PrsMetricsService } from "./prs-metrics.service";
import { PermissionsModule } from "../core/permissions/permissions.module";
import { AuthModule } from "../auth/auth.module";
import { OwnerOrManagerGuard } from "../common/guards/owner-or-manager.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@Module({
  imports: [PermissionsModule, AuthModule],
  controllers: [PrsController, PrsMetricsController],
  providers: [PrsService, PrsMetricsService, OwnerOrManagerGuard, JwtAuthGuard],
  exports: [PrsService],
})
export class PrsModule {}
