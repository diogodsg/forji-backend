import React from "react";
import { GamifiedNavbar } from "./GamifiedNavbar";
import { GamifiedMobileNav } from "./GamifiedMobileNav";
import { TopNavbar } from "./TopNavbar";

interface GamifiedLayoutProps {
  children: React.ReactNode;
  userName: string;
  onLogout: () => void;
  showManager?: boolean;
  showAdmin?: boolean;
}

export function GamifiedLayout({
  children,
  userName,
  onLogout,
  showManager,
  showAdmin,
}: GamifiedLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed */}
      <GamifiedNavbar showManager={showManager} showAdmin={showAdmin} />

      {/* Mobile Navigation */}
      <GamifiedMobileNav showManager={showManager} showAdmin={showAdmin} />

      {/* Main Content - Com margin para compensar sidebar fixa */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <TopNavbar userName={userName} onLogout={onLogout} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
