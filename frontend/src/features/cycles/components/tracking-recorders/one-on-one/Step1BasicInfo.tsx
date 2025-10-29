import { User, Calendar, FileText, ListTodo } from "lucide-react";
import { useEffect } from "react";
import type { OneOnOneData } from "./types";
import TagInput from "./TagInput";
import XPBreakdown from "../shared/XPBreakdown";
import { calculateBonuses } from "./utils";
import { useWorkspaceUsers } from "@/features/admin/hooks/useWorkspaceUsers";
import SearchableUserSelect from "./SearchableUserSelect";

interface Step1BasicInfoProps {
  data: OneOnOneData;
  onChange: (updates: Partial<OneOnOneData>) => void;
  hasRecentOneOnOne?: boolean;
  nextEligibleDate?: Date | null;
  daysUntilEligible?: number;
}

export default function Step1BasicInfo({
  data,
  onChange,
  hasRecentOneOnOne = false,
  nextEligibleDate = null,
  daysUntilEligible = 0,
}: Step1BasicInfoProps) {
  const { users = [], loading: loadingUsers } = useWorkspaceUsers();

  const bonuses = calculateBonuses(data);
  const totalXP = bonuses.reduce((sum, b) => sum + b.value, 0);

  // Pre-select first user automatically when users are loaded
  useEffect(() => {
    if (!loadingUsers && users.length > 0 && !data.participant) {
      onChange({ participant: users[0].name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingUsers, users.length]);

  const handleWorkingOnAdd = (item: string) => {
    onChange({
      workingOn: [...data.workingOn, item],
    });
  };

  const handleWorkingOnRemove = (index: number) => {
    onChange({
      workingOn: data.workingOn.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Column - Main Form */}
      <div
        className="lg:col-span-2 space-y-5 overflow-y-auto px-2"
        style={{ maxHeight: "calc(680px - 200px)" }}
      >
        {/* Participant + Date (2 columns, compact) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Participant Select */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              Participante
            </label>
            <SearchableUserSelect
              users={users}
              value={data.participant}
              onChange={(value) => onChange({ participant: value })}
              disabled={loadingUsers || users.length === 0}
              placeholder={
                loadingUsers
                  ? "Carregando usuários..."
                  : users.length === 0
                  ? "Nenhum usuário encontrado"
                  : "Selecione o participante"
              }
            />
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              Data do 1:1
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Working On */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <ListTodo className="w-4 h-4 text-blue-500" />
            No que está trabalhando
          </label>
          <TagInput
            items={data.workingOn}
            onAdd={handleWorkingOnAdd}
            onRemove={handleWorkingOnRemove}
            placeholder="Digite e pressione Enter para adicionar..."
          />
        </div>

        {/* General Notes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Anotações Gerais
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.generalNotes}
            onChange={(e) => onChange({ generalNotes: e.target.value })}
            placeholder="Anotações sobre a conversa, contexto, etc. (obrigatório)"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>
      </div>

      {/* Right Column - XP Breakdown (Sticky) */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-0">
          <XPBreakdown
            bonuses={bonuses}
            total={totalXP}
            hasRecentOneOnOne={hasRecentOneOnOne}
            nextEligibleDate={nextEligibleDate}
            daysUntilEligible={daysUntilEligible}
          />
        </div>
      </div>
    </div>
  );
}
