import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  userName: string;
  showManager?: boolean;
  showAdmin?: boolean;
}

export function AppLayout({
  children,
  onLogout,
  userName,
  showManager,
  showAdmin,
}: AppLayoutProps) {
  return (
    <div className="h-screen w-full overflow-hidden flex bg-surface-100 text-gray-800">
      <Sidebar
        userName={userName}
        onLogout={onLogout}
        showManager={showManager}
        showAdmin={showAdmin}
      />
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <TopBar
          userName={userName}
          onLogout={onLogout}
          showManager={showManager}
        />
        {/* Breadcrumbs removed as requested */}
        <main className="relative flex-1 pb-4 flex min-h-0 overflow-y-auto">
          <div
            className="pointer-events-none select-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_12%_18%,#dbe4ff_0%,#e5ecff_35%,#f1f5ff_55%,#f8fafc_70%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/70" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6">
            {children}
          </div>
        </main>
        <footer className="mt-auto flex-none border-t border-surface-300/70 text-xs text-gray-500 bg-white/70 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
            <span>forge · MVP</span>
            <span>v0.0.1</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
