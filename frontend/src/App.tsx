import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyPrsPage } from "./pages/MyPrsPage";
import { ManagerPrsPage } from "./pages/ManagerPrsPage";
import { ManagerDashboardPage } from "./pages/ManagerDashboardPage";
import { MyPdiPage } from "./pages/MyPdiPage";
import LoginPage from "./pages/LoginPage";
import React from "react";
import { useAuth, AuthProvider as RawAuthProvider } from "./hooks/useAuth";
import { AppLayout } from "./layouts/AppLayout";
import AdminAccessPage from "./pages/AdminAccessPage.tsx";
const AuthProvider = RawAuthProvider as unknown as React.ComponentType<{
  children: React.ReactNode;
}>;

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
  const { user, logout } = useAuth();
  if (!user) return <LoginPage />;
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
