import { Module, forwardRef } from "@nestjs/common";
import { ManagementController } from "./management.controller";
import { ManagementService } from "./management.service";
import { AuthModule } from "src/auth/auth.module";
import { PermissionsModule } from "../core/permissions/permissions.module";

@Module({
  imports: [AuthModule, forwardRef(() => PermissionsModule)],
  controllers: [ManagementController],
  providers: [ManagementService],
  exports: [ManagementService],
})
export class ManagementModule {}
