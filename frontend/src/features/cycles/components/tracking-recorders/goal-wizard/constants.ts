import { TrendingUp, TrendingDown, Target, CheckCircle } from "lucide-react";
import type { GoalTypeConfig } from "./types";

// Goal Types Configuration
export const GOAL_TYPES: GoalTypeConfig[] = [
  {
    id: "increase",
    icon: TrendingUp,
    title: "Aumentar",
    description: "Meta de crescimento numérico",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    example: "Ex: Aumentar de 5 para 15 mentorias",
  },
  {
    id: "decrease",
    icon: TrendingDown,
    title: "Diminuir",
    description: "Meta de redução numérica",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    example: "Ex: Reduzir de 20h para 10h tempo de deploy",
  },
  {
    id: "percentage",
    icon: Target,
    title: "Porcentagem",
    description: "Meta com progresso percentual",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    example: "Ex: Atingir 90% de cobertura de testes",
  },
  {
    id: "binary",
    icon: CheckCircle,
    title: "Binário",
    description: "Meta de conclusão sim/não",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    example: "Ex: Obter certificação AWS",
  },
];
