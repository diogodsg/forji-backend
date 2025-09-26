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
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ManagementService, ManagementRuleDto } from "./management.service";

@Controller("management")
// @UseGuards(JwtAuthGuard) // Temporarily disabled due to initialization deadlock
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
}
