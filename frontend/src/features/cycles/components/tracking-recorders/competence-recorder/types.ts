export interface CompetenceData {
  name: string;
  category: string;
  initialLevel: "beginner" | "intermediate" | "advanced" | "expert";
  targetLevel: "beginner" | "intermediate" | "advanced" | "expert";
  description: string;
  evidences: string[];
}

export interface CompetenceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CompetenceData) => Promise<void>;
  prefillData?: Partial<CompetenceData>;
}
