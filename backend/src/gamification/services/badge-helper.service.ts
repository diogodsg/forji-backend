import { Injectable } from '@nestjs/common';
import { BadgeType } from '@prisma/client';

/**
 * Badge Helper Service
 * Serviço responsável por gerenciar informações sobre badges
 */
@Injectable()
export class BadgeHelperService {
  /**
   * Retorna nome amigável da badge
   */
  getBadgeName(type: BadgeType): string {
    const names: Record<BadgeType, string> = {
      STREAK_7: '7 Dias de Fogo 🔥',
      STREAK_30: '30 Dias de Chama 🔥🔥',
      STREAK_100: '100 Dias Imparável 🔥🔥🔥',
      GOAL_MASTER: 'Mestre das Metas 🎯',
      MENTOR: 'Mentor Dedicado 🎓',
      CERTIFIED: 'Certificado 📜',
      TEAM_PLAYER: 'Jogador de Equipe 🤝',
      FAST_LEARNER: 'Aprendiz Rápido 🚀',
      CONSISTENT: 'Consistente ⭐',
    };
    return names[type] || type;
  }

  /**
   * Retorna descrição da badge
   */
  getBadgeDescription(type: BadgeType): string {
    const descriptions: Record<BadgeType, string> = {
      STREAK_7: 'Manteve streak de 7 dias consecutivos',
      STREAK_30: 'Manteve streak de 30 dias consecutivos',
      STREAK_100: 'Manteve streak de 100 dias consecutivos',
      GOAL_MASTER: 'Completou 10 metas',
      MENTOR: 'Realizou 5 sessões de mentoria',
      CERTIFIED: 'Obteve 3 certificações',
      TEAM_PLAYER: 'Realizou 10 reuniões 1:1',
      FAST_LEARNER: 'Subiu 3 níveis em uma competência',
      CONSISTENT: 'Atualizou metas por 30 dias seguidos',
    };
    return descriptions[type] || '';
  }
}
