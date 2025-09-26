import { FiUsers, FiShield, FiGithub, FiUserCheck } from "react-icons/fi";
import type { AdminUser } from "../types";

interface Props {
  users: AdminUser[];
  loading: boolean;
}

export function UserMetricsCards({ users, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-4"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.isAdmin).length;
  const usersWithGithub = users.filter((u) => u.githubId).length;
  const usersWithManagers = users.filter((u) => u.managers.length > 0).length;

  const metrics = [
    {
      title: "Total de Usuários",
      value: totalUsers,
      icon: FiUsers,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Administradores",
      value: adminUsers,
      icon: FiShield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Com GitHub",
      value: usersWithGithub,
      icon: FiGithub,
      color: "text-gray-800",
      bgColor: "bg-gray-50",
    },
    {
      title: "Com Gerentes",
      value: usersWithManagers,
      icon: FiUserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className="bg-white/80 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
