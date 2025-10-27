import {
  CycleHeroSection,
  QuickActionsBar,
  GoalsDashboard,
  CompetenciesSection,
  ActivitiesTimeline,
} from "../features/cycles";
import {
  SkeletonHeroSection,
  SkeletonGoalsDashboard,
  SkeletonCompetencies,
  SkeletonActivitiesTimeline,
} from "./Skeleton";
import { ConditionalSection } from "./LoadingStates";

interface CyclePageContentProps {
  userData: any;
  cycleData: any;
  goalsData: any[];
  competenciesData: any[];
  activitiesData: any[];
  handleActionClick: (actionId: string) => void;
  handleGoalUpdate: (goalId: string) => void;
  handleGoalEdit: (goalId: string) => void;
  handleGoalDelete: (goalId: string) => void;
  handleViewCompetency: () => void;
  handleCompetenceUpdate: (competencyId: string) => void;
  handleDeleteCompetency: (competencyId: string) => void;
  handleActivityDetails: (activityId: string) => void;

  // Loading states para seções específicas
  loading?: {
    goals?: boolean;
    competencies?: boolean;
    activities?: boolean;
    gamification?: boolean;
  };
}

export function CyclePageContent({
  userData,
  cycleData,
  goalsData,
  competenciesData,
  activitiesData,
  handleActionClick,
  handleGoalUpdate,
  handleGoalEdit,
  handleGoalDelete,
  handleViewCompetency,
  handleCompetenceUpdate,
  handleDeleteCompetency,
  handleActivityDetails,
  loading = {},
}: CyclePageContentProps) {
  return (
    <div className="container mx-auto px-6 py-6 max-w-7xl">
      {/* Hero Section - Gamificação Central */}
      <div className="mb-8">
        <ConditionalSection
          loading={loading.gamification || false}
          skeleton={<SkeletonHeroSection />}
        >
          <CycleHeroSection user={userData} cycle={cycleData} />
        </ConditionalSection>
      </div>

      {/* Quick Actions Bar - Sempre Visível (sem loading) */}
      <div className="mb-8">
        <QuickActionsBar onActionClick={handleActionClick} />
      </div>

      {/* Goals & Competencies - 50/50 Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Goals Dashboard (50%) */}
        <ConditionalSection
          loading={loading.goals || false}
          skeleton={<SkeletonGoalsDashboard />}
        >
          <GoalsDashboard
            goals={goalsData}
            onUpdateGoal={handleGoalUpdate}
            onEditGoal={handleGoalEdit}
            onDeleteGoal={handleGoalDelete}
          />
        </ConditionalSection>

        {/* Competencies Section (50%) */}
        <ConditionalSection
          loading={loading.competencies || false}
          skeleton={<SkeletonCompetencies />}
        >
          <CompetenciesSection
            competencies={competenciesData}
            onViewCompetency={handleViewCompetency}
            onUpdateProgress={handleCompetenceUpdate}
            onDeleteCompetency={handleDeleteCompetency}
          />
        </ConditionalSection>
      </div>

      {/* Activities Timeline - Full Width */}
      <ConditionalSection
        loading={loading.activities || false}
        skeleton={<SkeletonActivitiesTimeline />}
      >
        <ActivitiesTimeline
          activities={activitiesData}
          onViewDetails={handleActivityDetails}
        />
      </ConditionalSection>
    </div>
  );
}
