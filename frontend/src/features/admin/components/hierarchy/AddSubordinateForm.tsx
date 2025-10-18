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
  selectedTeamIds: string[]; // UUID[]
  selectedPersonIds: string[]; // UUID[]
  teamSearch: string;
  personSearch: string;
  onTeamSearchChange: (value: string) => void;
  onPersonSearchChange: (value: string) => void;
  onToggleTeam: (teamId: string) => void; // UUID
  onTogglePerson: (userId: string) => void; // UUID
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
