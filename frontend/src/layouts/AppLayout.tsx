import React from "react";
import { Sidebar } from "../components/nav/Sidebar";
import { TopBar } from "../components/nav/TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  userName: string;
}

export function AppLayout({ children, onLogout, userName }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-surface-100 text-gray-800">
      <Sidebar userName={userName} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar userName={userName} onLogout={onLogout} />
        {/* Breadcrumbs removed as requested */}
        <main className="relative flex-1 pb-10">
          <div className="pointer-events-none select-none opacity-60 absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,#c7d2fe,transparent_60%)]" />
          <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6">
            {children}
          </div>
        </main>
        <footer className="mt-auto border-t border-surface-300/70 text-xs text-gray-500 bg-white/70 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
            <span>forge · MVP</span>
            <span>v0.0.1</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
