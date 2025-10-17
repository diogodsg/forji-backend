import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth";

interface RequireAdminRouteProps {
  children: ReactNode;
  to?: string;
}

export function RequireAdminRoute({
  children,
  to = "/",
}: RequireAdminRouteProps) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user?.isAdmin) return <Navigate to={to} replace />;
  return <>{children}</>;
}
