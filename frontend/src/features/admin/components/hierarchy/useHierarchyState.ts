import { useState, useEffect } from "react";
import type { ManagementRuleType } from "@/features/management/types";

interface UseHierarchyStateProps {
  isOpen: boolean;
  userId: number;
}

export function useHierarchyState({ isOpen }: UseHierarchyStateProps) {
  const [step, setStep] = useState<"list" | "add">("list");
  const [ruleType, setRuleType] = useState<ManagementRuleType>("INDIVIDUAL");
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState<number[]>([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [personSearch, setPersonSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Reset states when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setStep("list");
      setRuleType("INDIVIDUAL");
      setSelectedTeamIds([]);
      setSelectedPersonIds([]);
      setTeamSearch("");
      setPersonSearch("");
      setError(null);
      setConfirmDelete(null);
      setCreating(false);
    }
  }, [isOpen]);

  return {
    step,
    setStep,
    ruleType,
    setRuleType,
    selectedTeamIds,
    setSelectedTeamIds,
    selectedPersonIds,
    setSelectedPersonIds,
    teamSearch,
    setTeamSearch,
    personSearch,
    setPersonSearch,
    creating,
    setCreating,
    error,
    setError,
    confirmDelete,
    setConfirmDelete,
  };
}
