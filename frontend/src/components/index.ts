/**
 * Skeleton Components Index
 *
 * Exportações centralizadas de todos os componentes de skeleton
 * Seguindo o design system da Forge
 */

// Base skeleton components
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
} from "./Skeleton";

// Page skeleton components
export {
  SkeletonHeroSection,
  SkeletonQuickActions,
  SkeletonGoalsDashboard,
  SkeletonCompetencies,
  SkeletonActivitiesTimeline,
  SkeletonCyclePage,
} from "./Skeleton";

// Modal skeleton components
export {
  SkeletonGoalCreatorModal,
  SkeletonActivityDetailsModal,
  SkeletonCompetencyUpdateModal,
  SkeletonModal,
} from "./ModalSkeletons";

// Loading state utilities
export {
  CycleSectionLoadings,
  useLoadingStates,
  ConditionalSection,
} from "./LoadingStates";

// Type definitions for loading states
export interface LoadingState {
  cycle?: boolean;
  goals?: boolean;
  competencies?: boolean;
  activities?: boolean;
  gamification?: boolean;
}

export interface SectionLoadingProps {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
