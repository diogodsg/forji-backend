import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth, AuthProvider } from "@/features/auth";
import { GamificationProvider } from "@/features/gamification";
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
 */
export default function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <BrowserRouter>
          <InnerApp />
        </BrowserRouter>
      </GamificationProvider>
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
