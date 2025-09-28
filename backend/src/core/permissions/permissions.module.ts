import { Module, forwardRef } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { ManagementModule } from "../../management/management.module";

@Module({
  imports: [forwardRef(() => ManagementModule)],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionsModule {}
