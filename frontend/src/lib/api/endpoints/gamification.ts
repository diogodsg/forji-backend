/**
 * Gamification API Client
 *
 * Endpoints para sistema de gamificação:
 * - GET /api/gamification/profile: Perfil completo do usuário
 * - GET /api/gamification/badges: Lista de badges
 */

import { apiClient } from "../client";
import type {
  GamificationProfileResponseDto,
  BadgeResponseDto,
} from "../../../../shared-types/cycles.types";

/**
 * GET /api/gamification/profile - Buscar perfil de gamificação
 */
export async function getGamificationProfile(): Promise<GamificationProfileResponseDto> {
  const response = await apiClient.get<GamificationProfileResponseDto>(
    "/gamification/profile"
  );
  return response.data;
}

/**
 * GET /api/gamification/badges - Listar badges
 */
export async function getGamificationBadges(): Promise<BadgeResponseDto[]> {
  const response = await apiClient.get<BadgeResponseDto[]>(
    "/gamification/badges"
  );
  return response.data;
}
