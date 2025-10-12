import { useMemo } from "react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  type: "certification" | "milestone" | "goal" | "recognition" | "skill";
  date: string;
  competency?: string;
  impact: "high" | "medium" | "low";
  evidence?: string;
  points?: number;
}

// Mock data dos achievements - depois deve ser substituído por hook real do backend
const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "AWS Solutions Architect - Associate",
    description:
      "Certificação oficial AWS para arquitetura de soluções em nuvem",
    type: "certification",
    date: "2024-06-15",
    competency: "Cloud Computing",
    impact: "high",
    evidence: "Certificado #AWS-SA-2024-123456",
    points: 100,
  },
  {
    id: 2,
    title: "Liderança de Projeto Crítico",
    description:
      "Liderou com sucesso a migração do sistema legado, entregue no prazo e orçamento",
    type: "milestone",
    date: "2024-05-20",
    competency: "Liderança",
    impact: "high",
    evidence: "Projeto Migration-2024",
    points: 80,
  },
  {
    id: 3,
    title: "Mentor do Semestre",
    description: "Reconhecimento pela mentoria de 3 desenvolvedores juniores",
    type: "recognition",
    date: "2024-04-10",
    competency: "Desenvolvimento de Pessoas",
    impact: "medium",
    evidence: "Feedback dos mentorados",
    points: 60,
  },
  {
    id: 4,
    title: "Meta de Produtividade Q1",
    description: "Superou em 15% a meta de entregas do primeiro trimestre",
    type: "goal",
    date: "2024-03-31",
    competency: "Produtividade",
    impact: "medium",
    evidence: "Relatório de performance Q1",
    points: 50,
  },
  {
    id: 5,
    title: "Skill: React Advanced",
    description: "Demonstrou proficiência avançada em React e hooks",
    type: "skill",
    date: "2024-02-14",
    competency: "Desenvolvimento Frontend",
    impact: "low",
    evidence: "Code review e projeto portfolio",
    points: 40,
  },
];

export function useUserPoints(_userId?: number) {
  // TODO: Substituir por chamada real ao backend quando disponível
  // const { data: achievements, isLoading } = useQuery(['achievements', userId], () => fetchUserAchievements(userId));

  const achievements = mockAchievements;
  const isLoading = false;

  const totalPoints = useMemo(() => {
    return achievements.reduce(
      (sum, achievement) => sum + (achievement.points || 0),
      0
    );
  }, [achievements]);

  return {
    totalPoints,
    achievements,
    isLoading,
  };
}
