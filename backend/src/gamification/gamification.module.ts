import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { PrismaModule } from '../prisma/prisma.module';

// Use Cases
import {
  GetProfileUseCase,
  GetBadgesUseCase,
  AddXpUseCase,
  UpdateStreakUseCase,
  CheckBadgesUseCase,
  CreateProfileUseCase,
} from './use-cases';

// Services
import { GamificationCalculatorService } from './services/gamification-calculator.service';
import { BadgeHelperService } from './services/badge-helper.service';

/**
 * GamificationModule - Refactored
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
  providers: [
    // Main Service (Facade)
    GamificationService,

    // Use Cases
    GetProfileUseCase,
    GetBadgesUseCase,
    AddXpUseCase,
    UpdateStreakUseCase,
    CheckBadgesUseCase,
    CreateProfileUseCase,

    // Helper Services
    GamificationCalculatorService,
    BadgeHelperService,
  ],
  exports: [GamificationService], // Exportar para uso por outros módulos
})
export class GamificationModule {}
