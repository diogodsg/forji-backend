import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ManagementService } from '../management.service';

/**
 * Guard para verificar se o usuário logado é gestor do subordinado especificado
 *
 * Uso:
 * @UseGuards(JwtAuthGuard, ManagerGuard)
 * @Get('/management/subordinates/:subordinateId/...')
 */
@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => ManagementService))
    private managementService: ManagementService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const managerId = request.user?.userId;
    const subordinateId = request.params?.subordinateId;
    const workspaceId = request.user?.workspaceId;

    console.log('🔍 [ManagerGuard] Verificando permissão:', {
      managerId,
      subordinateId,
      workspaceId,
    });

    if (!managerId) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (!subordinateId) {
      throw new ForbiddenException('ID do subordinado não fornecido');
    }

    if (!workspaceId) {
      throw new ForbiddenException('Workspace não identificado');
    }

    // Verificar se o usuário logado gerencia o subordinado (INDIVIDUAL ou TEAM)
    const isManaged = await this.managementService.isUserManagedBy(
      subordinateId,
      managerId,
      workspaceId,
    );

    console.log('🔍 [ManagerGuard] Resultado da verificação:', {
      isManaged,
      managerId,
      subordinateId,
    });

    if (!isManaged) {
      throw new ForbiddenException('Você não tem permissão para acessar dados deste usuário');
    }

    return true;
  }
}
