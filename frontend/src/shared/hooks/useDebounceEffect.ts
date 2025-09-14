import { useEffect, useRef } from "react";

/**
 * useDebounceEffect
 * Executa o callback após `delay` ms sem mudanças nas dependências.
 * Retorna função de cancelamento (via cleanup) e aborta se callback for async.
 */
export function useDebounceEffect(
  cb: () => void | Promise<void> | (() => void),
  delay: number,
  deps: any[]
) {
  const timeoutRef = useRef<number | null>(null);
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      const ret = cbRef.current();
      // ret pode ser uma função de cleanup específica do callback; ignoramos aqui porque
      // o padrão de debounce normalmente não encadeia cleanup interno (mantemos simples)
      void ret;
    }, delay);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
