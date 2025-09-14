import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { logger } from "../../common/logger/pino";
import { PermissionService } from "../../core/permissions/permission.service";

@Injectable()
export class OwnerOrManagerGuard implements CanActivate {
  constructor(private permission: PermissionService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const requesterId = req.user?.id;
    if (!requesterId) {
      logger.warn(
        { msg: "guard.ownerOrManager.noRequester", path: req.path },
        "OwnerOrManagerGuard deny (no requester)"
      );
      return false;
    }
    const paramUserId = req.params?.userId || req.params?.id;
    const queryOwner = req.query?.ownerUserId;
    const rawTarget = paramUserId ?? queryOwner;
    if (!rawTarget) {
      logger.debug(
        { msg: "guard.ownerOrManager.noTarget", requesterId, path: req.path },
        "OwnerOrManagerGuard allow (no target)"
      );
      return true; // rota não referencia outro usuário
    }
    const target = parseInt(String(rawTarget), 10);
    if (!Number.isFinite(target)) {
      logger.warn(
        {
          msg: "guard.ownerOrManager.invalidTarget",
          requesterId,
          rawTarget,
          path: req.path,
        },
        "OwnerOrManagerGuard deny (invalid target)"
      );
      throw new ForbiddenException();
    }
    const ok = await this.permission.isOwnerOrManager(requesterId, target);
    if (!ok) {
      logger.warn(
        {
          msg: "guard.ownerOrManager.denied",
          requesterId,
          target,
          path: req.path,
        },
        "OwnerOrManagerGuard deny"
      );
      throw new ForbiddenException();
    }
    logger.debug(
      {
        msg: "guard.ownerOrManager.allowed",
        requesterId,
        target,
        path: req.path,
      },
      "OwnerOrManagerGuard allow"
    );
    return true;
  }
}
