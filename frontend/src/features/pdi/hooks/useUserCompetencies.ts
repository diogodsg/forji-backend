import { useState, useEffect } from "react";

interface SelectedCompetency {
  competencyId: string;
  targetLevel: number;
  currentLevel?: number;
}

// Dados mockados para demonstração
const MOCK_USER_COMPETENCIES: SelectedCompetency[] = [
  {
    competencyId: "react-frontend",
    targetLevel: 3,
    currentLevel: 2,
  },
  {
    competencyId: "backend-apis",
    targetLevel: 2,
    currentLevel: 1,
  },
  {
    competencyId: "communication",
    targetLevel: 2,
    currentLevel: 1,
  },
];

export function useUserCompetencies(userId?: number) {
  const [competencies, setCompetencies] = useState<SelectedCompetency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      setCompetencies(MOCK_USER_COMPETENCIES);
      setIsLoading(false);
    }, 500);
  }, [userId]);

  const saveCompetencies = async (newCompetencies: SelectedCompetency[]) => {
    // TODO: Implementar chamada real ao backend
    console.log("Salvando competências:", newCompetencies);
    setCompetencies(newCompetencies);
    return Promise.resolve();
  };

  return {
    competencies,
    isLoading,
    saveCompetencies,
  };
}
