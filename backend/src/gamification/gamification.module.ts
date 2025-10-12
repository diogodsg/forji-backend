import { forwardRef, Module } from "@nestjs/common";
import { GamificationService } from "./gamification.service";
import { GamificationController } from "./gamification.controller";
import { ActionValidationService } from "./action-validation.service";
import { ProfileDetectorService } from "./profile-detector.service";
import { MultiplierService } from "./multiplier.service";
import { PermissionsModule } from "src/core/permissions/permissions.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule, forwardRef(() => PermissionsModule)],
  providers: [
    GamificationService,
    ActionValidationService,
    ProfileDetectorService,
    MultiplierService,
  ],
  controllers: [GamificationController],
  exports: [
    GamificationService,
    ActionValidationService,
    ProfileDetectorService,
    MultiplierService,
  ],
})
export class GamificationModule {}
