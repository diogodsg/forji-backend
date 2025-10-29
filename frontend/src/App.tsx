import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth, AuthProvider } from "@/features/auth";
import { GamificationProvider } from "@/features/gamification";
import { ToastProvider, ToastContainer } from "@/components/Toast";
import { AppLayout } from "./layouts/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ScreenLoading, PageLoading, LoginLoading } from "./lib/fallbacks";
import { ErrorBoundary } from "./lib/ErrorBoundary";
import { useXpAnimations, XpAnimationContainer } from "@/components/XpFloating";
import { useCelebrations } from "@/hooks/useCelebrations";

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
const PDIEditPage = lazy(() =>
  import("./pages/PDIEditPage").then((m) => ({
    default: m.PDIEditPage,
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
      <BrowserRouter>
        <AuthProvider>
          <GamificationProvider>
            <InnerApp />
            <ToastContainer />
          </GamificationProvider>
        </AuthProvider>
      </BrowserRouter>
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

  // XP Animations & Celebrations (top-level)
  const { triggerXpAnimation } = useXpAnimations();
  const { triggerSparkles, triggerLevelUp, triggerAchievement, triggerMega } =
    useCelebrations();

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
      {/* Debug Buttons - EPIC CELEBRATIONS TESTING */}
      {import.meta.env.DEV && import.meta.env.DEBUGAA && (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
          {/* XP Tests - Different amounts with auto-confetti */}
          <div className="bg-black/80 px-3 py-2 rounded-lg">
            <div className="text-white text-xs font-bold mb-1 text-center">
              XP Gains
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  triggerXpAnimation(
                    25,
                    window.innerWidth / 2,
                    window.innerHeight / 2
                  );
                }}
                className="px-3 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all hover:scale-105 font-semibold text-xs"
                title="Test +25 XP with default confetti"
              >
                +25 XP
              </button>
              <button
                onClick={() => {
                  triggerXpAnimation(
                    50,
                    window.innerWidth / 2,
                    window.innerHeight / 2
                  );
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all hover:scale-105 font-semibold text-xs"
                title="Test +50 XP with achievement confetti"
              >
                +50 XP
              </button>
              <button
                onClick={() => {
                  triggerXpAnimation(
                    100,
                    window.innerWidth / 2,
                    window.innerHeight / 2
                  );
                }}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all hover:scale-105 font-semibold text-xs"
                title="Test +100 XP with levelup confetti"
              >
                +100 XP
              </button>
              <button
                onClick={() => {
                  triggerXpAnimation(
                    350,
                    window.innerWidth / 2,
                    window.innerHeight / 2
                  );
                }}
                className="px-3 py-2 bg-violet-600 text-white rounded-lg shadow-lg hover:bg-violet-700 transition-all hover:scale-105 font-semibold text-xs"
                title="Test +350 XP (1:1 amount)"
              >
                +350 XP
              </button>
            </div>
          </div>

          {/* Epic Celebrations */}
          <div className="bg-black/80 px-3 py-2 rounded-lg">
            <div className="text-white text-xs font-bold mb-1 text-center">
              Epic Effects
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  triggerSparkles();
                }}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all hover:scale-105 font-semibold text-xs"
                title="Test Sparkles + Confetti"
              >
                🎊 Sparkles
              </button>
              <button
                onClick={() => {
                  triggerLevelUp(5);
                }}
                className="px-3 py-2 bg-amber-600 text-white rounded-lg shadow-lg hover:bg-amber-700 transition-all hover:scale-105 font-semibold text-xs"
                title="Test Level Up Celebration (only level-up animation)"
              >
                ⭐ Level 5
              </button>
              <button
                onClick={() => {
                  triggerAchievement("Meta Trimestral!", "Parabéns!");
                }}
                className="px-3 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all hover:scale-105 font-semibold text-xs"
                title="Test Achievement Trophy"
              >
                🏆 Trophy
              </button>
              <button
                onClick={() => {
                  triggerMega();
                }}
                className="px-3 py-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white rounded-lg shadow-lg hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 transition-all hover:scale-105 font-semibold text-xs"
                title="Test MEGA Everything"
              >
                🌈 MEGA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* XP Animation Container - Global */}
      <XpAnimationContainer />

      {/* Epic Celebrations são fornecidas pelo GamificationProvider */}

      <AppLayout
        userName={user.name}
        onLogout={logout}
        showManager={!!user.isManager}
        showAdmin={!!user.isAdmin}
      >
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Dashboard Gamificado como homepage */}
            <Route index element={<CurrentCyclePageOptimized />} />
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

            {/* PDI Management for Managers */}
            <Route path="/users/:userId/pdi/edit" element={<PDIEditPage />} />

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
