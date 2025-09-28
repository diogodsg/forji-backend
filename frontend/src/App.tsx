import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth, AuthProvider } from "@/features/auth";
import { AppLayout } from "./layouts/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ScreenLoading, PageLoading, LoginLoading } from "./lib/fallbacks";
import { ErrorBoundary } from "./lib/ErrorBoundary";

/**
 * Core pages are lazy-loaded to reduce the initial bundle size.
 * Only providers + the flow shell (InnerApp) are eagerly loaded.
 */
const ManagerDashboardPage = lazy(() =>
  import("./pages/ManagerDashboardPage").then((m) => ({
    default: m.ManagerDashboardPage,
  }))
);
const ManagerUserEditPage = lazy(() =>
  import("./pages/ManagerUserEditPage").then((m) => ({
    default: m.ManagerUserEditPage,
  }))
);
const MyPdiPage = lazy(() =>
  import("./pages/MyPdiPage").then((m) => ({ default: m.MyPdiPage }))
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminAccessPage = lazy(() => import("./pages/AdminAccessPage"));
const AdminUserEditPage = lazy(() =>
  import("./pages/AdminUserEditPage").then((m) => ({
    default: m.AdminUserEditPage,
  }))
);

/**
 * Root component: sets up auth + router context.
 * Conditional auth logic lives inside `InnerApp` for testability and clarity.
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <InnerApp />
      </BrowserRouter>
    </AuthProvider>
  );
}

/**
 * Orchestrates authentication flow and private routes.
 * States:
 *  - loading: token validation -> splash prevents flicker between login and app
 *  - unauthenticated: lazy-loads login screen
 *  - authenticated: mounts layout + lazy routes
 * Admin route is registered only when `user.isAdmin` is true.
 */
function InnerApp() {
  const { user, logout, loading } = useAuth();

  // Loading splash while resolving /auth/me
  if (loading) return <ScreenLoading label="Loading..." />;

  if (!user) {
    return (
      <Suspense fallback={<LoginLoading label="Loading login..." />}>
        <LoginPage />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
      <AppLayout
        userName={user.name}
        onLogout={logout}
        showManager={!!user.isManager}
        showAdmin={!!user.isAdmin}
      >
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Redirect root to PDI (prioridade solicitada) */}
            <Route index element={<Navigate to="/me/pdi" replace />} />
            <Route path="/me/pdi" element={<MyPdiPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/manager" element={<ManagerDashboardPage />} />
            <Route
              path="/manager/users/:userId"
              element={<ManagerUserEditPage />}
            />
            {user.isAdmin && (
              <>
                <Route path="/admin" element={<AdminAccessPage />} />
                <Route
                  path="/admin/users/:userId"
                  element={<AdminUserEditPage />}
                />
              </>
            )}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </ErrorBoundary>
  );
}
