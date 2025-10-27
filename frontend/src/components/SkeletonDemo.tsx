/**
 * Skeleton Loading Demo - Para testar os componentes de skeleton
 *
 * Este componente pode ser usado temporariamente para testar
 * os diferentes estados de skeleton loading
 */

import { useState } from "react";
import {
  SkeletonCyclePage,
  SkeletonHeroSection,
  SkeletonGoalsDashboard,
  SkeletonCompetencies,
  SkeletonActivitiesTimeline,
  SkeletonQuickActions,
  ConditionalSection,
} from "./index";

export function SkeletonDemo() {
  const [loadingStates, setLoadingStates] = useState({
    page: false,
    hero: false,
    goals: false,
    competencies: false,
    activities: false,
    quickActions: false,
  });

  const toggleLoading = (key: keyof typeof loadingStates) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loadingStates.page) {
    return <SkeletonCyclePage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        {/* Controls */}
        <div className="mb-8 p-4 bg-white rounded-2xl border border-surface-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">
            Skeleton Loading Demo
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(loadingStates).map(([key, isLoading]) => (
              <button
                key={key}
                onClick={() => toggleLoading(key as keyof typeof loadingStates)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isLoading
                    ? "bg-brand-500 text-white"
                    : "bg-surface-200 text-surface-700 hover:bg-surface-300"
                }`}
              >
                {key}: {isLoading ? "ON" : "OFF"}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <ConditionalSection
            loading={loadingStates.hero}
            skeleton={<SkeletonHeroSection />}
          >
            <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800">
                Hero Section (Real Content)
              </h2>
              <p className="text-gray-600">
                This is where the actual hero content would be displayed.
              </p>
            </div>
          </ConditionalSection>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <ConditionalSection
            loading={loadingStates.quickActions}
            skeleton={<SkeletonQuickActions />}
          >
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions (Real Content)
              </h2>
              <div className="flex justify-center space-x-4">
                <button className="px-4 py-2 bg-brand-500 text-white rounded-xl">
                  Action 1
                </button>
                <button className="px-4 py-2 bg-brand-500 text-white rounded-xl">
                  Action 2
                </button>
                <button className="px-4 py-2 bg-brand-500 text-white rounded-xl">
                  Action 3
                </button>
                <button className="px-4 py-2 bg-brand-500 text-white rounded-xl">
                  Action 4
                </button>
              </div>
            </div>
          </ConditionalSection>
        </div>

        {/* Goals & Competencies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ConditionalSection
            loading={loadingStates.goals}
            skeleton={<SkeletonGoalsDashboard />}
          >
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Goals Dashboard (Real Content)
              </h2>
              <p className="text-gray-600">Goals would be displayed here...</p>
            </div>
          </ConditionalSection>

          <ConditionalSection
            loading={loadingStates.competencies}
            skeleton={<SkeletonCompetencies />}
          >
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Competencies (Real Content)
              </h2>
              <p className="text-gray-600">
                Competencies would be displayed here...
              </p>
            </div>
          </ConditionalSection>
        </div>

        {/* Activities Timeline */}
        <ConditionalSection
          loading={loadingStates.activities}
          skeleton={<SkeletonActivitiesTimeline />}
        >
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Activities Timeline (Real Content)
            </h2>
            <p className="text-gray-600">
              Activities timeline would be displayed here...
            </p>
          </div>
        </ConditionalSection>
      </div>
    </div>
  );
}
