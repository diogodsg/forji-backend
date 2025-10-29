/**
 * Modal Skeleton Components
 *
 * Skeleton components específicos para uso dentro de modais
 * Seguindo o design system da Forji
 */

import { Skeleton, SkeletonText, SkeletonAvatar } from "./Skeleton";

// Skeleton para Modal de Criação de Goal
export function SkeletonGoalCreatorModal() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonText width="w-48" height="h-6" />
        <SkeletonText width="w-32" height="h-4" />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <SkeletonText width="w-24" height="h-4" />
          <div
            className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-full animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>

        <div className="space-y-2">
          <SkeletonText width="w-32" height="h-4" />
          <div
            className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-24 w-full animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <SkeletonText width="w-20" height="h-4" />
            <div
              className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-full animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
          <div className="space-y-2">
            <SkeletonText width="w-24" height="h-4" />
            <div
              className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-full animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <div
          className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-20 animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
        <div
          className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-24 animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </div>
  );
}

// Skeleton para Modal de Activity Details
export function SkeletonActivityDetailsModal() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start space-x-4">
        <SkeletonAvatar size="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <SkeletonText width="w-48" height="h-5" />
          <SkeletonText width="w-32" height="h-4" />
          <SkeletonText width="w-24" height="h-3" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <SkeletonText width="w-full" height="h-4" />
          <SkeletonText width="w-5/6" height="h-4" />
          <SkeletonText width="w-4/5" height="h-4" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="p-3 text-center">
            <SkeletonText width="w-8" height="h-6" />
            <SkeletonText width="w-12" height="h-3" />
          </Skeleton>
          <Skeleton className="p-3 text-center">
            <SkeletonText width="w-8" height="h-6" />
            <SkeletonText width="w-12" height="h-3" />
          </Skeleton>
          <Skeleton className="p-3 text-center">
            <SkeletonText width="w-8" height="h-6" />
            <SkeletonText width="w-12" height="h-3" />
          </Skeleton>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <div
          className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-20 animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </div>
  );
}

// Skeleton para Modal de Competency Update
export function SkeletonCompetencyUpdateModal() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonText width="w-56" height="h-6" />
        <SkeletonText width="w-40" height="h-4" />
      </div>

      {/* Progress Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <SkeletonText width="w-24" height="h-4" />
            <SkeletonText width="w-12" height="h-4" />
          </div>
          <div
            className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-full h-3 w-full animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <SkeletonText width="w-28" height="h-4" />
            <div
              className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-20 w-full animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>

          <div className="space-y-2">
            <SkeletonText width="w-20" height="h-4" />
            <div
              className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-full animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <div
          className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-20 animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
        <div
          className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-28 animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </div>
  );
}

// Skeleton genérico para modais
export function SkeletonModal() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonText width="w-48" height="h-6" />
        <SkeletonText width="w-32" height="h-4" />
      </div>

      <div className="space-y-4">
        <SkeletonText width="w-full" height="h-4" />
        <SkeletonText width="w-5/6" height="h-4" />
        <SkeletonText width="w-4/5" height="h-4" />
      </div>

      <div className="flex justify-end space-x-3">
        <div
          className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-20 animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
        <div
          className="bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-lg h-10 w-24 animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </div>
  );
}
