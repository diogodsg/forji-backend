import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import QuickActionsWidget from "./QuickActionsWidget";
import XPIndicator from "./XPIndicator";
import QuickActionsModal from "./QuickActionsModal";
import {
  FiTarget,
  FiTrendingUp,
  FiStar,
  FiUsers,
  FiCalendar,
  FiZap,
  FiBarChart,
  FiArrowRight,
} from "react-icons/fi";

export function GamificationHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showQuickActions, setShowQuickActions] = useState(false);

  const isManager = !!user?.isManager;

  return (
    <div className="min-h-full w-full bg-[#f8fafc] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <FiTarget className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Acompanhe sua evolu????o e conquistas
                </p>
              </div>
            </div>
            <XPIndicator
              size="lg"
              showAddButton
              onAddXP={() => setShowQuickActions(true)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickActionsWidget />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiTrendingUp className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Progresso Semanal</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      XP esta semana
                    </span>
                    <span className="font-bold text-green-600">+125 XP</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">Meta: 200 XP</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiStar className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold">Conquistas</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FiZap className="w-3 h-3 text-yellow-600" />
                    </div>
                    <span className="text-sm">Primeira A????o</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiTarget className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-sm">Semana Completa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiUsers className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Ranking do Time</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Ana Silva", xp: 1250, pos: 1 },
                  { name: "Jo??o Santos", xp: 980, pos: 2 },
                  { name: "Maria Costa", xp: 875, pos: 3 },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">
                        #{member.pos}
                      </span>
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {member.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiCalendar className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Atividade Recente</h3>
              </div>
              <div className="space-y-3">
                {[
                  { action: "Mentorou colega", xp: 50, time: "2h atr??s" },
                  { action: "Completou task", xp: 25, time: "1 dia" },
                  { action: "Code review", xp: 30, time: "2 dias" },
                ].map((activity, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <div className="text-sm">{activity.action}</div>
                      <div className="text-xs text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600">
                      +{activity.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isManager && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FiBarChart className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">
                  Vis??o de Manager
                </h3>
              </div>
              <button
                onClick={() => navigate("/manager")}
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Dashboard completo <FiArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">5</div>
                <div className="text-sm text-indigo-700">Colaboradores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-indigo-700">Engajamento</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-indigo-700">
                  A????es esta semana
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <QuickActionsModal
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onSuccess={() => setShowQuickActions(false)}
      />
    </div>
  );
}
