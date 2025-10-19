import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * GamificationModule
 *
 * Módulo responsável pelo sistema de gamificação da plataforma:
 * - Gerenciamento de XP e níveis
 * - Sistema de streaks
 * - Desbloqueio de badges
 * - Perfis de gamificação
 */
@Module({
  imports: [PrismaModule],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService], // Exportar para uso por outros módulos
})
export class GamificationModule {}
