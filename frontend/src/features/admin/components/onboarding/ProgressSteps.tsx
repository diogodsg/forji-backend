import { User, Users, Building2, CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { OnboardingStep } from "./types";

interface ProgressStepsProps {
  steps: OnboardingStep[];
  currentStep: number;
}

const iconMap: Record<string, LucideIcon> = {
  User,
  Users,
  Building2,
  CheckCircle,
};

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      {steps.map((step, index) => {
        const Icon = iconMap[step.iconName];
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                index === currentStep
                  ? "bg-brand-50 text-brand-700 border border-brand-200"
                  : step.completed
                  ? "bg-success-50 text-success-700 border border-success-200"
                  : "bg-surface-100 text-gray-600 border border-surface-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-px bg-surface-300 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
