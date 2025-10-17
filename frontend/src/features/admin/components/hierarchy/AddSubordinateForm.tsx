import type { ManagementRuleType } from "@/features/management/types";
import { RuleTypeSelector } from "./RuleTypeSelector";
import { TeamSelector } from "./TeamSelector";
import { PersonSelector } from "./PersonSelector";
import type { User, Team } from "./types";

interface AddSubordinateFormProps {
  ruleType: ManagementRuleType;
  onRuleTypeChange: (type: ManagementRuleType) => void;
  teams: Team[];
  users: User[];
  selectedTeamIds: number[];
  selectedPersonIds: number[];
  teamSearch: string;
  personSearch: string;
  onTeamSearchChange: (value: string) => void;
  onPersonSearchChange: (value: string) => void;
  onToggleTeam: (teamId: number) => void;
  onTogglePerson: (userId: number) => void;
}

export function AddSubordinateForm({
  ruleType,
  onRuleTypeChange,
  teams,
  users,
  selectedTeamIds,
  selectedPersonIds,
  teamSearch,
  personSearch,
  onTeamSearchChange,
  onPersonSearchChange,
  onToggleTeam,
  onTogglePerson,
}: AddSubordinateFormProps) {
  return (
    <div className="space-y-6">
      <RuleTypeSelector ruleType={ruleType} onChange={onRuleTypeChange} />

      {ruleType === "TEAM" ? (
        <TeamSelector
          teams={teams}
          selectedTeamIds={selectedTeamIds}
          searchValue={teamSearch}
          onSearchChange={onTeamSearchChange}
          onToggleTeam={onToggleTeam}
        />
      ) : (
        <PersonSelector
          users={users}
          selectedPersonIds={selectedPersonIds}
          searchValue={personSearch}
          onSearchChange={onPersonSearchChange}
          onTogglePerson={onTogglePerson}
        />
      )}
    </div>
  );
}
