import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToast } from "./ToastContext";
import type { Toast, ToastType } from "./ToastContext";

/**
 * Configuração visual por tipo de toast
 * Segue o Design System Forge (tokens brand, success, error, warning)
 */
const toastConfig: Record<
  ToastType,
  {
    icon: React.ElementType;
    bgGradient: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    bgGradient: "from-emerald-50 to-green-50",
    borderColor: "border-emerald-200",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-900",
  },
  error: {
    icon: XCircle,
    bgGradient: "from-rose-50 to-rose-100",
    borderColor: "border-rose-200",
    iconColor: "text-error-600",
    textColor: "text-error-900",
  },
  warning: {
    icon: AlertTriangle,
    bgGradient: "from-amber-50 to-yellow-50",
    borderColor: "border-amber-200",
    iconColor: "text-warning-600",
    textColor: "text-warning-900",
  },
  info: {
    icon: Info,
    bgGradient: "from-indigo-50 to-purple-50",
    borderColor: "border-brand-200",
    iconColor: "text-brand-600",
    textColor: "text-brand-900",
  },
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

/**
 * Componente individual de Toast
 * Design: Gradiente suave + ícone + título opcional + mensagem + botão fechar
 */
function ToastItem({ toast, onRemove }: ToastItemProps) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-3 
        bg-gradient-to-br ${config.bgGradient}
        border ${config.borderColor}
        rounded-xl shadow-lg p-4 min-w-[320px] max-w-md
        animate-in slide-in-from-right duration-300
      `}
      role="alert"
      aria-live={toast.type === "error" ? "assertive" : "polite"}
    >
      {/* Ícone */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className={`text-sm font-semibold ${config.textColor} mb-0.5`}>
            {toast.title}
          </h4>
        )}
        <p className={`text-sm ${config.textColor} leading-relaxed`}>
          {toast.message}
        </p>
      </div>

      {/* Botão Fechar */}
      <button
        onClick={() => onRemove(toast.id)}
        className={`
          flex-shrink-0 ${config.iconColor} hover:opacity-70
          transition-opacity duration-150 focus:outline-none
          focus:ring-2 focus:ring-offset-2 focus:ring-brand-400 rounded
        `}
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Container de Toasts - Renderiza no canto superior direito
 * Position: fixed top-4 right-4
 * Z-index: 50 (acima de modais)
 */
export function ToastContainer() {
  const { toasts, remove } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </div>
    </div>
  );
}
