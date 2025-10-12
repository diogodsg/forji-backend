import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrsModule } from "./prs/prs.module";
import { PdiModule } from "./pdi/pdi.module";
import { PrismaModule } from "./core/prisma/prisma.module";
import { PermissionsModule } from "./core/permissions/permissions.module";
import { TeamsModule } from "./teams/teams.module";
import { ManagementModule } from "./management/management.module"; // Temporarily disabled
import { GamificationModule } from "./gamification/gamification.module";

@Module({
  // PrismaModule é global; ainda assim manter import explícito para clareza.
  imports: [
    PrismaModule,
    PermissionsModule,
    AuthModule,
    PrsModule,
    PdiModule,
    TeamsModule,
    ManagementModule, // Keep disabled until deadlock issue is resolved
    GamificationModule,
  ],
})
export class AppModule {}
