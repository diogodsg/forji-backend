import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrsController } from "./prs.controller";
import { PdiController } from "./pdi.controller";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PrsService } from "./prs.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_jwt_secret_here",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [PrsController, PdiController, AuthController],
  providers: [AuthService, JwtAuthGuard, PrsService],
})
export class AppModule {}
