import { Controller, Get, Query, UseGuards, Req } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PrsMetricsService } from "./prs-metrics.service";
import { PermissionService } from "../permissions/permission.service";

@Controller("prs/metrics")
@UseGuards(JwtAuthGuard)
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
        if (parsed !== req.user.id) {
          const ok = await PermissionService.isOwnerOrManager(
            req.user.id,
            parsed
          );
          if (!ok) return { error: "Forbidden" };
        }
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
