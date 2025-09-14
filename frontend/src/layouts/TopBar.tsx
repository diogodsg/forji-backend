// MOVED from src/components/nav/TopBar.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  userName: string;
  onLogout: () => void;
  showManager?: boolean;
  showAdmin?: boolean;
}

export function TopBar({
  userName,
  onLogout,
  showManager,
  showAdmin,
}: TopBarProps) {
  const navigate = useNavigate();
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Ignorar atalhos quando o usuário está digitando em campos interativos
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        const isEditable =
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          (target as any).isContentEditable === true;
        if (isEditable) {
          // Resetar flag para não "carregar" o g pressionado de dentro de inputs
          if (e.key.toLowerCase() === "g")
            (document as any)._navGPressed = false;
          return; // Não processa atalhos globais
        }
      }
      if (e.metaKey || e.ctrlKey) {
        if (e.key.toLowerCase() === "k") {
          e.preventDefault();
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
        if (k === "m" && showManager) navigate("/manager");
        if (k === "a" && showAdmin) navigate("/admin");
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, showManager, showAdmin]);
  const initial = userName?.[0]?.toUpperCase() || "U";
  return (
    <div className="md:hidden flex-none flex items-center justify-between h-14 px-4 border-b border-surface-300/70 bg-white/75 backdrop-blur sticky top-0 z-40">
      <span className="font-semibold tracking-tight text-gray-800 text-lg select-none">
        forge<span className="text-indigo-500">·</span>
      </span>
      <div className="flex items-center gap-3">
        <button
          className="text-[11px] text-gray-500 border border-surface-300 rounded px-2 py-1 hover:bg-surface-200"
          title={
            showManager || showAdmin
              ? `Atalho: g p / g d${showManager ? " / g m" : ""}${
                  showAdmin ? " / g a" : ""
                }`
              : "Atalho: g p / g d"
          }
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
// (Legacy re-export removed after deleting src/components/nav/TopBar)
