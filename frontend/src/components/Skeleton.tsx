/**
 * Skeleton Components - Design System Compliant
 *
 * Componentes de skeleton loading seguindo o design system da Forge
 * Baseado nos tokens de design violet e superfícies
 */

// Base Skeleton Component
export function Skeleton({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-surface-200/60 bg-gradient-to-r from-white to-surface-50/50 ${className}`}
    >
      {children}
    </div>
  );
}

// Text Skeleton
export function SkeletonText({
  width = "w-full",
  height = "h-4",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded animate-shimmer ${height} ${width}`}
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  );
}

// Avatar Skeleton
export function SkeletonAvatar({ size = "w-12 h-12" }: { size?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-full animate-shimmer ${size}`}
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  );
}

// Card Skeleton
export function SkeletonCard({ className = "p-5" }: { className?: string }) {
  return (
    <Skeleton className={`shadow-sm ${className}`}>
      <div className="space-y-3">
        <SkeletonText width="w-3/4" height="h-4" />
        <SkeletonText width="w-1/2" height="h-3" />
        <SkeletonText width="w-2/3" height="h-3" />
      </div>
    </Skeleton>
  );
}

// Hero Section Skeleton
export function SkeletonHeroSection() {
  return (
    <Skeleton className="p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <SkeletonAvatar size="w-20 h-20" />
          <div className="space-y-3">
            <SkeletonText width="w-48" height="h-6" />
            <SkeletonText width="w-32" height="h-4" />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div
            className="w-24 h-24 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-full animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
          <SkeletonText width="w-16" height="h-3" />
        </div>
      </div>
    </Skeleton>
  );
}

// Quick Actions Skeleton
export function SkeletonQuickActions() {
  return (
    <Skeleton className="p-6 shadow-sm">
      <div className="flex justify-center space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-xl w-32 h-12 animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        ))}
      </div>
    </Skeleton>
  );
}

// Goals Dashboard Skeleton
export function SkeletonGoalsDashboard() {
  return (
    <div className="space-y-4">
      <Skeleton className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <SkeletonText width="w-32" height="h-5" />
          <div
            className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg w-24 h-8 animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonText width="w-2/3" height="h-4" />
              <div
                className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-full h-2 w-full animate-shimmer"
                style={{ backgroundSize: "200% 100%" }}
              />
            </div>
          ))}
        </div>
      </Skeleton>
    </div>
  );
}

// Competencies Section Skeleton
export function SkeletonCompetencies() {
  return (
    <div className="space-y-4">
      <Skeleton className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <SkeletonText width="w-40" height="h-5" />
          <div
            className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg w-24 h-8 animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonText width="w-full" height="h-4" />
              <div
                className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-full h-2 w-full animate-shimmer"
                style={{ backgroundSize: "200% 100%" }}
              />
              <SkeletonText width="w-3/4" height="h-3" />
            </div>
          ))}
        </div>
      </Skeleton>
    </div>
  );
}

// Activities Timeline Skeleton
export function SkeletonActivitiesTimeline() {
  return (
    <div className="space-y-4">
      <Skeleton className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <SkeletonText width="w-48" height="h-5" />
          <div
            className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg w-32 h-8 animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start space-x-4">
              <div
                className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-full w-3 h-3 mt-2 animate-shimmer"
                style={{ backgroundSize: "200% 100%" }}
              />
              <div className="flex-1 space-y-2">
                <SkeletonText width="w-3/4" height="h-4" />
                <SkeletonText width="w-1/2" height="h-3" />
                <SkeletonText width="w-1/4" height="h-3" />
              </div>
            </div>
          ))}
        </div>
      </Skeleton>
    </div>
  );
}

// Page Skeleton (Full Page Loading)
export function SkeletonCyclePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        {/* Hero Section Skeleton */}
        <div className="mb-8">
          <SkeletonHeroSection />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mb-8">
          <SkeletonQuickActions />
        </div>

        {/* Goals & Competencies Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SkeletonGoalsDashboard />
          <SkeletonCompetencies />
        </div>

        {/* Activities Timeline Skeleton */}
        <SkeletonActivitiesTimeline />
      </div>
    </div>
  );
}
