import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number; // ms, 0 = permanent
}

export interface ToastContextValue {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => string;
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  remove: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Hook para acessar o sistema de toasts
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
}

/**
 * Provider do sistema de toasts
 * Suporta: success, error, warning, info
 * Auto-dismiss configurável (padrão: 5s)
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback(
    (toastData: Omit<Toast, "id">) => {
      const id = `toast_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
      const newToast: Toast = {
        id,
        ...toastData,
        duration: toastData.duration ?? 3000, // Default: 3 segundos
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss se duration > 0
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          remove(id);
        }, newToast.duration);
      }

      return id;
    },
    [remove]
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      return toast({ type: "success", message, title, duration });
    },
    [toast]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      return toast({ type: "error", message, title, duration });
    },
    [toast]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      return toast({ type: "info", message, title, duration });
    },
    [toast]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      return toast({ type: "warning", message, title, duration });
    },
    [toast]
  );

  const value: ToastContextValue = {
    toasts,
    toast,
    success,
    error,
    info,
    warning,
    remove,
    clear,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}
