import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrsController } from "./prs/prs.controller";
import { PrsMetricsController } from "./prs/prs-metrics.controller";
import { PdiController } from "./pdi/pdi.controller";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { PrsService } from "./prs/prs.service";
import { PrsMetricsService } from "./prs/prs-metrics.service";
import { PdiService } from "./pdi/pdi.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_jwt_secret_here",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [
    PrsController,
    PrsMetricsController,
    PdiController,
    AuthController,
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    PrsService,
    PrsMetricsService,
    PdiService,
  ],
})
export class AppModule {}
