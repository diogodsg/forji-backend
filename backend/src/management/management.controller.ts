import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import { ManagementService, ManagementRuleDto } from "./management.service";

@Controller("management")
@UseGuards(JwtAuthGuard)
export class ManagementController {
  constructor(private managementService: ManagementService) {}

  // Criar uma nova regra de gerenciamento
  @Post("rules")
  async createRule(@Request() req: any, @Body() rule: ManagementRuleDto) {
    const managerId = req.user?.id;
    if (!managerId) {
      throw new Error("User not authenticated");
    }
    return this.managementService.createRule(managerId, rule);
  }

  // Listar todas as regras do gerente atual
  @Get("rules")
  async getMyRules(@Request() req: any) {
    const managerId = req.user?.id;
    if (!managerId) {
      throw new Error("User not authenticated");
    }
    return this.managementService.getManagerRules(managerId);
  }

  // Remover uma regra
  @Delete("rules/:id")
  async removeRule(
    @Request() req: any,
    @Param("id", ParseIntPipe) ruleId: number
  ) {
    const managerId = req.user?.id;
    if (!managerId) {
      throw new Error("User not authenticated");
    }
    return this.managementService.removeRule(managerId, ruleId);
  }

  // Obter todos os subordinados efetivos
  @Get("subordinates")
  async getMySubordinates(@Request() req: any) {
    const managerId = req.user?.id;
    if (!managerId) {
      throw new Error("User not authenticated");
    }
    return this.managementService.getEffectiveSubordinates(managerId);
  }

  // Verificar se alguém é subordinado
  @Get("subordinates/:userId/check")
  async checkSubordinate(
    @Request() req: any,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    const managerId = req.user?.id;
    if (!managerId) {
      throw new Error("User not authenticated");
    }
    const isSubordinate = await this.managementService.isSubordinate(
      managerId,
      userId
    );
    return { isSubordinate };
  }

  // Obter detalhes sobre por que alguém é subordinado
  @Get("subordinates/:userId/source")
  async getSubordinateSource(
    @Request() req: any,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    const managerId = req.user?.id;
    if (!managerId) {
      throw new Error("User not authenticated");
    }
    return this.managementService.getSubordinateSource(managerId, userId);
  }

  // Obter dados completos do dashboard do manager
  @Get("dashboard")
  async getManagerDashboard(@Request() req: any) {
    const managerId = req.user?.id;
    if (!managerId) {
      throw new Error("User not authenticated");
    }
    return this.managementService.getManagerDashboard(managerId);
  }

  // Obter dados consolidados do dashboard + times do manager
  @Get("dashboard/complete")
  async getManagerDashboardComplete(@Request() req: any) {
    const managerId = req.user?.id;
    if (!managerId) {
      throw new Error("User not authenticated");
    }
    return this.managementService.getManagerDashboardComplete(managerId);
  }

  // ============ ADMIN ENDPOINTS ============

  // Admin: Criar regra para qualquer usuário
  @Post("admin/rules")
  @UseGuards(AdminGuard)
  async adminCreateRule(
    @Body() data: ManagementRuleDto & { managerId: number }
  ) {
    const { managerId, ...rule } = data;
    return this.managementService.createRule(managerId, rule);
  }

  // Admin: Listar regras de qualquer usuário
  @Get("admin/rules")
  @UseGuards(AdminGuard)
  async adminGetRules(@Query("managerId") managerId?: string) {
    if (managerId) {
      const managerIdNum = parseInt(managerId, 10);
      if (isNaN(managerIdNum)) {
        throw new BadRequestException("Invalid managerId parameter");
      }
      return this.managementService.getManagerRules(managerIdNum);
    }
    // Se não especificar managerId, retorna todas as regras do sistema
    return this.managementService.getAllRules();
  }

  // Admin: Remover regra de qualquer usuário
  @Delete("admin/rules/:id")
  @UseGuards(AdminGuard)
  async adminRemoveRule(@Param("id", ParseIntPipe) ruleId: number) {
    return this.managementService.adminRemoveRule(ruleId);
  }

  // Admin: Listar subordinados de qualquer usuário
  @Get("admin/subordinates")
  @UseGuards(AdminGuard)
  async adminGetSubordinates(
    @Query("managerId", ParseIntPipe) managerId: number
  ) {
    return this.managementService.getEffectiveSubordinates(managerId);
  }

  // Admin: Obter dashboard de qualquer manager
  @Get("admin/dashboard")
  @UseGuards(AdminGuard)
  async adminGetManagerDashboard(
    @Query("managerId", ParseIntPipe) managerId: number
  ) {
    return this.managementService.getManagerDashboard(managerId);
  }
}
