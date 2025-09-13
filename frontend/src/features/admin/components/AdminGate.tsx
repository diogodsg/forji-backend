import type { ReactNode } from "react";
import { useAuth } from "@/features/auth";

interface AdminGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminGate({ children, fallback }: AdminGateProps) {
  const { user, loading } = useAuth();
  if (loading) return null; // rely on global spinner
  if (!user?.isAdmin)
    return (
      fallback || (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur border border-rose-200 rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-rose-700">
              Acesso negado
            </h2>
            <p className="text-sm text-rose-600 mt-1">
              Esta área é restrita a administradores.
            </p>
          </div>
        </div>
      )
    );
  return <>{children}</>;
}
