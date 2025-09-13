import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyPrsPage } from "./pages/MyPrsPage";
import { ManagerPrsPage } from "./pages/ManagerPrsPage";
import { ManagerDashboardPage } from "./pages/ManagerDashboardPage";
import { MyPdiPage } from "./pages/MyPdiPage";
import LoginPage from "./pages/LoginPage";
import { useAuth, AuthProvider } from "@/features/auth";
import { AppLayout } from "./layouts/AppLayout";
import AdminAccessPage from "./pages/AdminAccessPage.tsx";
// AuthProvider now comes directly from feature barrel.

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <InnerApp />
      </BrowserRouter>
    </AuthProvider>
  );
}

function InnerApp() {
  const { user, logout, loading } = useAuth() as any;
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("auth:token");
  if (loading && hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-sky-50">
        <div className="flex flex-col items-center gap-3 text-gray-600 text-sm">
          <div className="h-10 w-10 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }
  if (!user && !loading) return <LoginPage />;
  if (!user) return null; // evita flash
  return (
    <AppLayout
      userName={user.name}
      onLogout={logout}
      showManager={!!user.isManager}
      showAdmin={!!user.isAdmin}
    >
      <Routes>
        <Route path="/" element={<MyPrsPage />} />
        <Route path="/me/prs" element={<MyPrsPage />} />
        <Route path="/me/pdi" element={<MyPdiPage />} />
        <Route path="/users/:userId/prs" element={<ManagerPrsPage />} />
        <Route path="/manager" element={<ManagerDashboardPage />} />
        {user.isAdmin && <Route path="/admin" element={<AdminAccessPage />} />}
      </Routes>
    </AppLayout>
  );
}

// Old Header/Footer removed in favor of AppLayout / Sidebar / TopBar.
