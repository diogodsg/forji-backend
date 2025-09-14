import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { OwnerOrManagerGuard } from "../common/guards/owner-or-manager.guard";
import { PrsMetricsService } from "./prs-metrics.service";

@Controller("prs/metrics")
@UseGuards(JwtAuthGuard, OwnerOrManagerGuard)
export class PrsMetricsController {
  constructor(private readonly metrics: PrsMetricsService) {}

  @Get()
  async get(
    @Req() req: any,
    @Query("ownerUserId") ownerUserId?: string,
    @Query("repo") repo?: string,
    @Query("since") since?: string,
    @Query("until") until?: string
  ) {
    let uid: number | undefined = undefined;
    if (ownerUserId) {
      const parsed = parseInt(ownerUserId, 10);
      if (Number.isFinite(parsed)) {
        // Guard OwnerOrManager (quando aplicado) validará acesso; fallback simples aqui
        // Se não for próprio e guard não estiver aplicado, manter checagem futura.
        uid = parsed;
      }
    }
    return this.metrics.basicMetrics({
      ownerUserId: uid,
      repo: repo || undefined,
      since,
      until,
    });
  }
}
