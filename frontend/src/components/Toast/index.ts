/**
 * Toast System - Barrel Export
 *
 * Sistema de notificações seguindo o Design System Forji
 *
 * Uso:
 *
 * 1. Adicionar ToastProvider no App.tsx:
 *
 *    import { ToastProvider, ToastContainer } from '@/components/Toast';
 *
 *    <ToastProvider>
 *      <App />
 *      <ToastContainer />
 *    </ToastProvider>
 *
 * 2. Usar em qualquer componente:
 *
 *    import { useToast } from '@/components/Toast';
 *
 *    const { success, error, warning, info } = useToast();
 *
 *    success("Operação concluída com sucesso!");
 *    error("Erro ao processar requisição", "Erro de Conexão");
 *    warning("Atenção: dados não salvos");
 *    info("Nova funcionalidade disponível", "Novidade");
 */

export { ToastProvider, useToast } from "./ToastContext";
export { ToastContainer } from "./ToastContainer";
export type { Toast, ToastType, ToastContextValue } from "./ToastContext";
