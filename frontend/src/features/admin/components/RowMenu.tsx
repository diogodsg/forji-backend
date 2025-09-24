import { useEffect, useRef, useState } from "react";
import { FiMoreHorizontal, FiGithub, FiShield, FiTrash2, FiUsers } from "react-icons/fi";

interface Props {
  isAdmin: boolean;
  hasGithub: boolean;
  onEditGithub: () => void;
  onClearGithub: () => void;
  onOpenManagers: () => void;
  onToggleAdmin: () => void;
  onRemove: () => void;
}

export function RowMenu({
  isAdmin,
  hasGithub,
  onEditGithub,
  onClearGithub,
  onOpenManagers,
  onToggleAdmin,
  onRemove,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);
  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-2 py-1 rounded border border-surface-300 bg-white text-gray-600 text-xs hover:bg-surface-100 inline-flex items-center justify-center"
        aria-label="Mais ações"
        title="Mais ações"
      >
        <FiMoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-surface-300 bg-white shadow-lg z-20 py-1">
          <button
            onClick={() => {
              onEditGithub();
              setOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface-100 text-gray-700 inline-flex items-center gap-2"
          >
            <FiGithub className="w-4 h-4" /> {hasGithub ? "Editar GitHub" : "Definir GitHub"}
          </button>
          {hasGithub && (
            <button
              onClick={() => {
                onClearGithub();
                setOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-rose-50 text-rose-600 inline-flex items-center gap-2"
            >
              <FiGithub className="w-4 h-4" /> Limpar GitHub
            </button>
          )}
          <button
            onClick={() => {
              onOpenManagers();
              setOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface-100 text-gray-700 inline-flex items-center gap-2"
          >
            <FiUsers className="w-4 h-4" /> Gerenciar gerentes
          </button>
          <button
            onClick={() => {
              onToggleAdmin();
              setOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface-100 text-gray-700 inline-flex items-center gap-2"
          >
            <FiShield className="w-4 h-4" /> {isAdmin ? "Remover admin" : "Tornar admin"}
          </button>
          <button
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-xs hover:bg-rose-50 text-rose-600 inline-flex items-center gap-2"
          >
            <FiTrash2 className="w-4 h-4" /> Remover usuário
          </button>
        </div>
      )}
    </div>
  );
}
