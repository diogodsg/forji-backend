import { User, Users } from "lucide-react";
import type { ManagementRuleType } from "@/features/management/types";

interface RuleTypeSelectorProps {
  ruleType: ManagementRuleType;
  onChange: (type: ManagementRuleType) => void;
}

export function RuleTypeSelector({
  ruleType,
  onChange,
}: RuleTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Tipo de Subordinação
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange("INDIVIDUAL")}
          className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
            ruleType === "INDIVIDUAL"
              ? "border-violet-500 bg-violet-50 text-violet-700 shadow-lg transform scale-105"
              : "border-gray-200 hover:border-violet-300 hover:bg-violet-25"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                ruleType === "INDIVIDUAL" ? "bg-violet-100" : "bg-gray-100"
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">Individual</div>
              <div className="text-sm text-gray-500">
                Gerenciar pessoas específicas
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange("TEAM")}
          className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
            ruleType === "TEAM"
              ? "border-violet-500 bg-violet-50 text-violet-700 shadow-lg transform scale-105"
              : "border-gray-200 hover:border-violet-300 hover:bg-violet-25"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                ruleType === "TEAM" ? "bg-violet-100" : "bg-gray-100"
              }`}
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">Por Equipe</div>
              <div className="text-sm text-gray-500">
                Gerenciar todos os membros de uma equipe
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
