import { createAvatar } from "@dicebear/core";
import * as micah from "@dicebear/micah";

export interface DiceBearAvatarOption {
  id: string;
  name: string;
  seed: string;
}

// Função para gerar URL do avatar DiceBear
export function getDiceBearAvatarUrl(seed: string, size: number = 128): string {
  const avatar = createAvatar(micah, {
    seed,
    size,
    // Opções de customização para melhor visual
    backgroundColor: ["d1d4f9"],
    backgroundType: ["gradientLinear"],
    // Opções específicas do Micah para avatares humanos diversos
    baseColor: ["ac6651", "f9c9b6"],

    earringsProbability: 30,
    glassesProbability: 25,
  });

  return avatar.toDataUri();
}

// Seeds pré-definidos com visuais interessantes
export const dicebearAvatarOptions: DiceBearAvatarOption[] = [
  {
    id: "avatar-1",
    name: "Vision",
    seed: "vision-2024-alpha",
  },
  {
    id: "avatar-2",
    name: "Strategy",
    seed: "strategy-prime-beta",
  },
  {
    id: "avatar-3",
    name: "Impact",
    seed: "impact-force-gamma",
  },
  {
    id: "avatar-4",
    name: "Insight",
    seed: "insight-mind-delta",
  },
  {
    id: "avatar-5",
    name: "Mentor",
    seed: "mentor-wise-epsilon",
  },
  {
    id: "avatar-6",
    name: "Leader",
    seed: "leader-bold-zeta",
  },
  {
    id: "avatar-7",
    name: "Catalyst",
    seed: "catalyst-spark-eta",
  },
  {
    id: "avatar-8",
    name: "Expert",
    seed: "expert-pro-theta",
  },
  {
    id: "avatar-9",
    name: "Sprint",
    seed: "sprint-fast-iota",
  },
  {
    id: "avatar-10",
    name: "Scrum",
    seed: "scrum-team-kappa",
  },
  {
    id: "avatar-11",
    name: "Kanban",
    seed: "kanban-flow-lambda",
  },
  {
    id: "avatar-12",
    name: "Pivot",
    seed: "pivot-change-mu",
  },
  {
    id: "avatar-13",
    name: "Agile",
    seed: "agile-move-nu",
  },
  {
    id: "avatar-14",
    name: "Design",
    seed: "design-craft-xi",
  },
  {
    id: "avatar-15",
    name: "Lean",
    seed: "lean-simple-omicron",
  },
  {
    id: "avatar-16",
    name: "Beta",
    seed: "beta-test-pi",
  },
  {
    id: "avatar-17",
    name: "Synergy",
    seed: "synergy-unite-rho",
  },
  {
    id: "avatar-18",
    name: "Growth",
    seed: "growth-rise-sigma",
  },
  {
    id: "avatar-19",
    name: "Trust",
    seed: "trust-solid-tau",
  },
  {
    id: "avatar-20",
    name: "Network",
    seed: "network-link-upsilon",
  },
  {
    id: "avatar-21",
    name: "Engage",
    seed: "engage-active-phi",
  },
  {
    id: "avatar-22",
    name: "Connect",
    seed: "connect-bridge-chi",
  },
  {
    id: "avatar-23",
    name: "Balance",
    seed: "balance-zen-psi",
  },
  {
    id: "avatar-24",
    name: "Focus",
    seed: "focus-sharp-omega",
  },
  {
    id: "avatar-25",
    name: "Summit",
    seed: "summit-peak-alpha2",
  },
  {
    id: "avatar-26",
    name: "Flow",
    seed: "flow-smooth-beta2",
  },
  {
    id: "avatar-27",
    name: "Peak",
    seed: "peak-high-gamma2",
  },
  {
    id: "avatar-28",
    name: "Horizon",
    seed: "horizon-far-delta2",
  },
  {
    id: "avatar-29",
    name: "Momentum",
    seed: "momentum-power-epsilon2",
  },
  {
    id: "avatar-30",
    name: "Spark",
    seed: "spark-bright-zeta2",
  },
  {
    id: "avatar-31",
    name: "Milestone",
    seed: "milestone-goal-eta2",
  },
  {
    id: "avatar-32",
    name: "Thrive",
    seed: "thrive-bloom-theta2",
  },
  {
    id: "avatar-33",
    name: "ROI",
    seed: "roi-value-iota2",
  },
  {
    id: "avatar-34",
    name: "KPI",
    seed: "kpi-metric-kappa2",
  },
  {
    id: "avatar-35",
    name: "Matrix",
    seed: "matrix-grid-lambda2",
  },
  {
    id: "avatar-36",
    name: "MVP",
    seed: "mvp-core-mu2",
  },
  {
    id: "avatar-37",
    name: "OKR",
    seed: "okr-target-nu2",
  },
  {
    id: "avatar-38",
    name: "Benchmark",
    seed: "benchmark-standard-xi2",
  },
  {
    id: "avatar-39",
    name: "Dashboard",
    seed: "dashboard-view-omicron2",
  },
  {
    id: "avatar-40",
    name: "Analytics",
    seed: "analytics-data-pi2",
  },
];

// Função para gerar avatar customizado com seed específico
export function generateCustomAvatar(seed: string, size: number = 128): string {
  return getDiceBearAvatarUrl(seed, size);
}

// Função para obter informações de um avatar por ID
export function getDiceBearAvatarById(
  id: string
): DiceBearAvatarOption | undefined {
  return dicebearAvatarOptions.find((avatar) => avatar.id === id);
}
