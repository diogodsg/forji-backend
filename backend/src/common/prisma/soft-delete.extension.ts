import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";

/**
 * Classe base para implementar soft delete em services
 * Fornece métodos comuns para soft delete, restore e consultas que respeitam soft delete
 */
@Injectable()
export abstract class SoftDeleteService {
  constructor(protected readonly prisma: PrismaService) {}

  /**
   * Adiciona automaticamente a condição deleted_at: null nas consultas
   */
  protected addSoftDeleteFilter(where: any = {}) {
    return {
      ...where,
      deleted_at: null,
    };
  }

  /**
   * Realiza soft delete de um registro
   */
  protected async softDelete(model: string, id: number | bigint) {
    return (this.prisma as any)[model].update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  /**
   * Realiza soft delete de múltiplos registros
   */
  protected async softDeleteMany(model: string, where: any) {
    return (this.prisma as any)[model].updateMany({
      where,
      data: { deleted_at: new Date() },
    });
  }

  /**
   * Restaura um registro soft deleted
   */
  protected async restore(model: string, id: number | bigint) {
    return (this.prisma as any)[model].update({
      where: { id },
      data: { deleted_at: null },
    });
  }

  /**
   * Busca registros incluindo os soft deleted
   */
  protected async findManyWithDeleted(model: string, args: any = {}) {
    return (this.prisma as any)[model].findMany(args);
  }

  /**
   * Busca apenas registros soft deleted
   */
  protected async findOnlyDeleted(model: string, args: any = {}) {
    return (this.prisma as any)[model].findMany({
      ...args,
      where: {
        ...args.where,
        deleted_at: { not: null },
      },
    });
  }

  /**
   * Realiza hard delete (delete real do banco)
   */
  protected async hardDelete(model: string, id: number | bigint) {
    return (this.prisma as any)[model].delete({
      where: { id },
    });
  }
}
