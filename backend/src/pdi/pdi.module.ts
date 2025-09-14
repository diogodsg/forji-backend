import { Module } from "@nestjs/common";
import { PdiController } from "./pdi.controller";
import { PdiService } from "./pdi.service";
import { PermissionsModule } from "../core/permissions/permissions.module";
import { AuthModule } from "../auth/auth.module";
import { OwnerOrManagerGuard } from "../common/guards/owner-or-manager.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@Module({
  imports: [PermissionsModule, AuthModule],
  controllers: [PdiController],
  providers: [PdiService, OwnerOrManagerGuard, JwtAuthGuard],
  exports: [PdiService],
})
export class PdiModule {}
