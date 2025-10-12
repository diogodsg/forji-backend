import React from "react";
import { GamifiedLayout } from "./GamifiedLayout";

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
    <GamifiedLayout
      userName={userName}
      onLogout={onLogout}
      showManager={showManager}
      showAdmin={showAdmin}
    >
      <div className="relative">
        {/* Background Pattern */}
        <div
          className="pointer-events-none select-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_12%_18%,#dbe4ff_0%,#e5ecff_35%,#f1f5ff_55%,#f8fafc_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50" />
        </div>

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </GamifiedLayout>
  );
}
