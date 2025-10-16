import { useState } from "react";
import { JsonViewer } from "./JsonViewer";

export function ComponentInfo() {
  const [activeModal] = useState<string | null>(null);

  const componentState = {
    activeModal,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent.substring(0, 50) + "...", // Truncate for smaller display
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    location: window.location.href.substring(0, 50) + "...", // Truncate for smaller display
  };

  return (
    <JsonViewer
      data={componentState}
      title="Component Environment"
      maxHeight="max-h-24"
    />
  );
}
