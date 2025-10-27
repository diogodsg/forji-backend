/**
 * Loading States Específicos para Seções da Página de Ciclo
 *
 * Componentes que mostram skeleton loading para seções específicas
 * que podem ter loading independente (goals, competencies, activities)
 */

import {
  SkeletonGoalsDashboard,
  SkeletonCompetencies,
  SkeletonActivitiesTimeline,
  SkeletonHeroSection,
  SkeletonCyclePage,
} from "./Skeleton";

interface LoadingStatesProps {
  loading: {
    cycle?: boolean;
    goals?: boolean;
    competencies?: boolean;
    activities?: boolean;
    gamification?: boolean;
  };
}

// Loading States para Seções Específicas
export function CycleSectionLoadings({ loading }: LoadingStatesProps) {
  // Se o ciclo está carregando, mostrar página inteira
  if (loading.cycle) {
    return <SkeletonCyclePage />;
  }

  return {
    // Hero loading (quando gamification está carregando)
    hero: loading.gamification ? <SkeletonHeroSection /> : null,

    // Goals loading
    goals: loading.goals ? <SkeletonGoalsDashboard /> : null,

    // Competencies loading
    competencies: loading.competencies ? <SkeletonCompetencies /> : null,

    // Activities loading
    activities: loading.activities ? <SkeletonActivitiesTimeline /> : null,

    // Quick Actions (geralmente não tem loading separado, mas pode ter)
    quickActions: null, // Para futuro uso se necessário
  };
}

// Hook para determinar se qualquer seção está carregando
export function useLoadingStates(loading: LoadingStatesProps["loading"]) {
  return {
    isPageLoading: loading.cycle,
    isHeroLoading: loading.gamification,
    isGoalsLoading: loading.goals,
    isCompetenciesLoading: loading.competencies,
    isActivitiesLoading: loading.activities,
    hasAnyLoading: Object.values(loading).some(Boolean),
  };
}

// Wrapper para seções condicionais com loading
interface ConditionalSectionProps {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ConditionalSection({
  loading,
  skeleton,
  children,
  className = "",
}: ConditionalSectionProps) {
  if (loading) {
    return <div className={className}>{skeleton}</div>;
  }

  return <div className={className}>{children}</div>;
}
