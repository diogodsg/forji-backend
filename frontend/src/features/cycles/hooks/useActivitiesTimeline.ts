/**
 * 📋 useActivitiesTimeline - Hook para mapear activities do backend para Timeline
 *
 * Mapeia ActivityTimelineDto[] (backend) → Activity[] (Timeline component)
 * Adiciona campos calculados e formatação necessária
 */

import { useMemo } from "react";
import type { ActivityTimelineDto } from "../../../../../shared-types/cycles.types";
import { ActivityType } from "../../../../../shared-types/cycles.types";

// Tipo esperado pela Timeline (frontend)
export interface TimelineActivity {
  id: string;
  type: "oneOnOne" | "mentoring" | "certification" | "milestone" | "competency";
  title: string;
  person?: string;
  topics?: string[];
  outcomes?: string;
  rating?: number;
  progress?: {
    from: number;
    to: number;
  };
  xpEarned: number;
  timestamp: Date;
  // Campos específicos de 1:1
  workingOn?: string[];
  generalNotes?: string;
  positivePoints?: string[];
  improvementPoints?: string[];
}

/**
 * Hook para mapear e processar activities para a Timeline
 */
export function useActivitiesTimeline(
  activities: ActivityTimelineDto[]
): TimelineActivity[] {
  return useMemo(() => {
    // Validação: garantir que activities é um array
    if (!activities || !Array.isArray(activities)) {
      console.warn(
        "⚠️ useActivitiesTimeline: activities não é um array:",
        activities
      );
      return [];
    }

    return activities.map((activity) => {
      // Base activity comum a todos os tipos
      const baseActivity = {
        id: activity.id,
        title: activity.title,
        xpEarned: activity.xpEarned,
        timestamp: new Date(activity.createdAt),
      };

      // Mapear tipo específico
      switch (activity.type) {
        case ActivityType.ONE_ON_ONE:
        case "ONE_ON_ONE": {
          // Backend pode retornar string
          // Backend retorna oneOnOne como objeto completo!
          const oneOnOneData = (activity as any).oneOnOne;

          if (!oneOnOneData) {
            console.warn(
              "⚠️ Activity ONE_ON_ONE sem dados oneOnOne:",
              activity
            );
            return {
              ...baseActivity,
              type: "oneOnOne" as const,
              person: "Participante desconhecido",
            };
          }

          return {
            ...baseActivity,
            type: "oneOnOne" as const,
            person: oneOnOneData.participantName || "Participante desconhecido",
            workingOn: oneOnOneData.workingOn || [],
            generalNotes:
              oneOnOneData.generalNotes || activity.description || undefined,
            positivePoints: oneOnOneData.positivePoints || [],
            improvementPoints: oneOnOneData.improvementPoints || [],
            topics: oneOnOneData.workingOn || [], // workingOn serve como topics
          };
        }

        case ActivityType.MENTORING:
        case "MENTORING": {
          // Backend pode retornar string
          // Backend retorna mentoring como objeto completo!
          const mentoringData = (activity as any).mentoring;

          if (!mentoringData) {
            console.warn(
              "⚠️ Activity MENTORING sem dados mentoring:",
              activity
            );
            return {
              ...baseActivity,
              type: "mentoring" as const,
              person: "Mentor desconhecido",
            };
          }

          return {
            ...baseActivity,
            type: "mentoring" as const,
            person: mentoringData.mentorName || "Mentor desconhecido",
            topics: mentoringData.topics || [],
            outcomes: mentoringData.nextSteps?.join(", ") || undefined,
          };
        }

        case ActivityType.CERTIFICATION:
        case "CERTIFICATION": {
          // Backend pode retornar string
          // Backend retorna certification como objeto completo!
          const certificationData = (activity as any).certification;

          if (!certificationData) {
            console.warn(
              "⚠️ Activity CERTIFICATION sem dados certification:",
              activity
            );
            return {
              ...baseActivity,
              type: "certification" as const,
              person: "Plataforma desconhecida",
            };
          }

          return {
            ...baseActivity,
            type: "certification" as const,
            person: certificationData.platform || "Plataforma desconhecida",
            topics: certificationData.skills || [],
            outcomes: certificationData.certificateUrl
              ? `Certificado: ${certificationData.certificateUrl}`
              : undefined,
          };
        }

        default:
          // Tipo genérico ou desconhecido
          return {
            ...baseActivity,
            type: "milestone" as const,
            outcomes: activity.description || undefined,
          };
      }
    });
  }, [activities]);
}
