import { useNavigate } from "react-router-dom";
import type { TeamMember } from "../types";

interface TeamMembersGridProps {
  members: TeamMember[];
  showDetailedInfo?: boolean;
  onMemberClick?: (member: TeamMember) => void;
}

export function TeamMembersGrid({
  members,
  showDetailedInfo = false,
  onMemberClick,
}: TeamMembersGridProps) {
  const navigate = useNavigate();

  const handleMemberClick = (member: TeamMember) => {
    if (onMemberClick) {
      onMemberClick(member);
    } else {
      // Navega para o perfil do usuário
      navigate(`/users/${member.id}/profile`);
    }
  };
  if (members.length === 0) {
    return (
      <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5 space-y-4">
        <header className="flex items-center justify-between">
          <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-surface-300/60">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </span>
            Membros da Equipe
          </h3>
        </header>
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <p className="text-sm text-gray-500">Nenhum membro encontrado</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5 space-y-4">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-surface-300/60">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </span>
          Membros da Equipe ({members.length})
        </h3>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => handleMemberClick(member)}
            className="flex items-center space-x-3 p-4 rounded-xl border border-surface-300 bg-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-left w-full cursor-pointer"
          >
            {/* Avatar com gradiente Design System */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-sky-500 to-indigo-400 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              {showDetailedInfo && member.isOnline && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate text-sm">
                {member.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {member.role}
              </div>
              {showDetailedInfo && (
                <div className="text-xs text-gray-500 mt-1">{member.email}</div>
              )}
            </div>

            {/* Stats */}
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-medium text-brand-600">
                Lv {member.level}
              </div>
              <div className="text-xs text-gray-600 tabular-nums">
                {member.xp.toLocaleString()} XP
              </div>
              {showDetailedInfo && member.badges.length > 0 && (
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  {member.badges.length} badges
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {showDetailedInfo && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(
                  members.reduce((acc, m) => acc + m.level, 0) / members.length
                )}
              </div>
              <div className="text-xs text-gray-500">Nível Médio</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 tabular-nums">
                {Math.round(
                  members.reduce((acc, m) => acc + m.xp, 0) / members.length
                ).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">XP Médio</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 tabular-nums">
                {members.filter((m) => m.isOnline).length}
              </div>
              <div className="text-xs text-gray-500">Online Agora</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
