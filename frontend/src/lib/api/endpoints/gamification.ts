/**
 * Gamification API Client
 *
 * Endpoints para sistema de gamificação:
 * - GET /api/gamification/profile: Perfil completo do usuário autenticado
 * - GET /api/gamification/profile/:userId: Perfil de outro usuário
 * - GET /api/gamification/badges: Lista de badges
 */

import { apiClient } from "../client";
import type {
  GamificationProfileResponseDto,
  BadgeResponseDto,
} from "../../../../shared-types/cycles.types";

/**
 * GET /api/gamification/profile - Buscar perfil de gamificação do usuário autenticado
 */
export async function getGamificationProfile(): Promise<GamificationProfileResponseDto> {
  const response = await apiClient.get<GamificationProfileResponseDto>(
    "/gamification/profile"
  );
  return response.data;
}

/**
 * GET /api/gamification/profile/:userId - Buscar perfil de gamificação de outro usuário
 */
export async function getGamificationProfileByUserId(
  userId: string
): Promise<GamificationProfileResponseDto> {
  const response = await apiClient.get<GamificationProfileResponseDto>(
    `/gamification/profile/${userId}`
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
