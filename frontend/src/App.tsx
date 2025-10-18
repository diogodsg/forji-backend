import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useAuth, AuthProvider } from "@/features/auth";
import { GamificationProvider } from "@/features/gamification";
import { ToastProvider, ToastContainer } from "@/components/Toast";
import { AppLayout } from "./layouts/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ScreenLoading, PageLoading, LoginLoading } from "./lib/fallbacks";
import { ErrorBoundary } from "./lib/ErrorBoundary";

/**
 * Core pages are lazy-loaded to reduce the initial bundle size.
 * Only providers + the flow shell (InnerApp) are eagerly loaded.
 */
const LeaderboardPage = lazy(() =>
  import("./pages/LeaderboardPage").then((m) => ({
    default: m.LeaderboardPage,
  }))
);
const GamificationGuidePage = lazy(() =>
  import("./pages/GamificationGuidePage").then((m) => ({
    default: m.GamificationGuidePage,
  }))
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminAccessPage = lazy(() => import("./pages/AdminAccessPage"));
const CurrentCyclePageOptimized = lazy(() =>
  import("./pages/CurrentCyclePageOptimized").then((m) => ({
    default: m.CurrentCyclePageOptimized,
  }))
);
const ProfilePage = lazy(() =>
  import("./features/profile").then((m) => ({
    default: m.ProfilePage,
  }))
);
const TeamsPage = lazy(() => import("./pages/TeamsPage"));
const HomePage = lazy(() => import("./pages/HomePage"));

/**
 * Root component: sets up auth + router context.
 * Conditional auth logic lives inside `InnerApp` for testability and clarity.
 *
 * IMPORTANTE: ToastProvider deve estar ANTES de AuthProvider
 * porque useAuth usa useToast internamente
 */
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <GamificationProvider>
          <BrowserRouter>
            <InnerApp />
            <ToastContainer />
          </BrowserRouter>
        </GamificationProvider>
      </AuthProvider>
    </ToastProvider>
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

  console.log("🔍 InnerApp render - user:", user, "loading:", loading);

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
        {/* Debug temporário */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded z-50 font-mono">
            isAdmin: {user.isAdmin ? "true" : "false"} | isManager:{" "}
            {user.isManager ? "true" : "false"}
          </div>
        )}

        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Dashboard Gamificado como homepage */}
            <Route index element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            {/* Desenvolvimento (novo hub) */}
            <Route
              path="/development"
              element={<CurrentCyclePageOptimized />}
            />
            {/* Teams (colaboração e gestão de equipes) */}
            <Route path="/teams" element={<TeamsPage />} />
            {/* Leaderboard (rankings e competição) */}
            <Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* Guide (página educativa) */}
            <Route path="/guide" element={<GamificationGuidePage />} />

            {/* Legacy routes mantidas para compatibilidade */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* User Search & Feedback */}
            <Route path="/users/:userId/profile" element={<ProfilePage />} />

            {/* New Profile System */}
            <Route path="/me" element={<ProfilePage />} />

            {/* Admin routes */}
            {user.isAdmin && (
              <>
                <Route path="/admin" element={<AdminAccessPage />} />
              </>
            )}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </ErrorBoundary>
  );
}
