import { useEffect, useRef, useState } from "react";

/**
 * useDeferredLoading
 * Garante que o estado de loading apareça apenas se durar mais que `delay` ms
 * e mantém skeleton visível por pelo menos `minVisible` ms para evitar flicker.
 */
export function useDeferredLoading(
  loading: boolean,
  options?: { delay?: number; minVisible?: number }
) {
  const { delay = 120, minVisible = 280 } = options || {};
  const [show, setShow] = useState(false);
  const startRef = useRef<number | null>(null);
  const timeoutAppear = useRef<number | null>(null);
  const timeoutHide = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      if (timeoutHide.current) {
        clearTimeout(timeoutHide.current);
        timeoutHide.current = null;
      }
      // Programar aparição após delay
      timeoutAppear.current = window.setTimeout(() => {
        startRef.current = performance.now();
        setShow(true);
      }, delay);
    } else {
      // Se não está loading: decidir esconder
      if (timeoutAppear.current) {
        clearTimeout(timeoutAppear.current);
        timeoutAppear.current = null;
      }
      if (!show) return; // Ainda não mostrou
      const elapsed = startRef.current
        ? performance.now() - startRef.current
        : 0;
      const remaining = elapsed < minVisible ? minVisible - elapsed : 0;
      timeoutHide.current = window.setTimeout(() => {
        setShow(false);
        startRef.current = null;
      }, remaining);
    }
    return () => {
      if (timeoutAppear.current) clearTimeout(timeoutAppear.current);
      if (timeoutHide.current) clearTimeout(timeoutHide.current);
    };
  }, [loading, delay, minVisible, show]);

  return show;
}
