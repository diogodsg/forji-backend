export interface CompetenceData {
  name: string;
  category: string;
  initialLevel: 1 | 2 | 3 | 4 | 5;
  targetLevel: 1 | 2 | 3 | 4 | 5;
  description: string;
  evidences: string[];
}

export interface CompetenceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CompetenceData) => Promise<void>;
  prefillData?: Partial<CompetenceData>;
}
