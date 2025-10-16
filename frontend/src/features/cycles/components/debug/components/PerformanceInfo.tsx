import { useState } from "react";
import { JsonViewer } from "./JsonViewer";

export function PerformanceInfo() {
  const [renderCount, setRenderCount] = useState(0);
  const [renderTimes, setRenderTimes] = useState<number[]>([]);

  // Track render performance
  useState(() => {
    const startTime = performance.now();
    setRenderCount((prev) => prev + 1);

    // Measure render time
    setTimeout(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      setRenderTimes((prev) => [...prev.slice(-9), renderTime]);
    }, 0);
  });

  const avgRenderTime =
    renderTimes.length > 0
      ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length
      : 0;

  const performanceData = {
    renderCount,
    averageRenderTime: `${avgRenderTime.toFixed(2)}ms`,
    lastRenderTimes: renderTimes.slice(-3).map((t) => `${t.toFixed(2)}ms`), // Only show last 3
    memoryUsage: (performance as any).memory
      ? {
          usedJSHeapSize: `${(
            (performance as any).memory.usedJSHeapSize /
            1024 /
            1024
          ).toFixed(2)}MB`,
          totalJSHeapSize: `${(
            (performance as any).memory.totalJSHeapSize /
            1024 /
            1024
          ).toFixed(2)}MB`,
        }
      : "Not available",
  };

  return (
    <JsonViewer
      data={performanceData}
      title="Performance Metrics"
      maxHeight="max-h-24"
    />
  );
}
