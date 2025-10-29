export interface OneOnOneData {
  participant: string;
  date: string;
  workingOn: string[];
  generalNotes: string;
  positivePoints: string[];
  improvementPoints: string[];
  nextSteps: string[];
}

export interface OneOnOneRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OneOnOneData) => void;
  prefillData?: Partial<OneOnOneData>;
  cycleId?: string; // Current cycle ID to check XP eligibility
}
