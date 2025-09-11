import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  userName: string;
  onLogout: () => void;
}

export function TopBar({ userName, onLogout }: TopBarProps) {
  const navigate = useNavigate();

  // Keyboard shortcuts (g p, g d, g m, ctrl/cmd+k placeholder)
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey) {
        if (e.key.toLowerCase() === "k") {
          e.preventDefault();
          // Future: open command palette
        }
      }
      if (e.key === "g") {
        (document as any)._navGPressed = true;
        setTimeout(() => {
          (document as any)._navGPressed = false;
        }, 800);
      } else if ((document as any)._navGPressed) {
        const k = e.key.toLowerCase();
        if (k === "p") navigate("/me/prs");
        if (k === "d") navigate("/me/pdi");
        if (k === "m") navigate("/users/123/prs");
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const initial = userName?.[0]?.toUpperCase() || "U";
  return (
    <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-surface-300/70 bg-white/75 backdrop-blur sticky top-0 z-40">
      <span className="font-semibold tracking-tight text-gray-800 text-lg select-none">
        forge<span className="text-indigo-500">·</span>
      </span>
      <div className="flex items-center gap-3">
        <button
          className="text-[11px] text-gray-500 border border-surface-300 rounded px-2 py-1 hover:bg-surface-200"
          title="Atalho: g p / g d / g m"
          onClick={() => navigate("/me/prs")}
        >
          PRs
        </button>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-surface-300/70 bg-white/70">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-[12px] flex items-center justify-center font-semibold shadow-inner">
            {initial}
          </div>
          <button
            onClick={onLogout}
            className="text-[10px] uppercase tracking-wide font-semibold text-gray-500 hover:text-rose-600 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
