import { Users } from "lucide-react";

interface TeamStatsProps {
  membersCount: number;
}

export function TeamStats({ membersCount }: TeamStatsProps) {
  return (
    <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-lg p-5 border border-brand-200/50">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-md">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-brand-900">{membersCount}</p>
          <p className="text-sm text-brand-700 font-medium">
            {membersCount === 1 ? "Membro" : "Membros"} na equipe
          </p>
        </div>
      </div>
    </div>
  );
}
