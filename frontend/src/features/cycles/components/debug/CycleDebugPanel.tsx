import { useState, useEffect } from "react";
import { Bug, EyeOff, Zap, Target, Clock, Settings } from "lucide-react";
import {
  DebugSection,
  StateViewer,
  PerformanceInfo,
  ComponentInfo,
  ActionSimulator,
} from "./components";

export function CycleDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);

  // Função simples para garantir que o painel fique dentro da tela
  const constrainPosition = (x: number, y: number) => {
    const PANEL_WIDTH = 320;
    const PANEL_HEIGHT = 600; // Altura generosa para segurança
    const MARGIN = 10;

    const maxX = Math.max(MARGIN, window.innerWidth - PANEL_WIDTH - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - PANEL_HEIGHT - MARGIN);

    return {
      x: Math.min(Math.max(MARGIN, x), maxX),
      y: Math.min(Math.max(MARGIN, y), maxY),
    };
  };

  // Posicionar no canto inferior direito na inicialização
  useEffect(() => {
    const PANEL_WIDTH = 320;
    const MARGIN = 20;

    const x = window.innerWidth - PANEL_WIDTH - MARGIN;
    const y = MARGIN;

    setPosition(constrainPosition(x, y));
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      setPosition(constrainPosition(newX, newY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      {/* CSS para animação */}
      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(20px) translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
          }
        }
      `}</style>

      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed bottom-4 right-4 z-[60] p-3 rounded-full shadow-lg transition-all duration-200 ${
          isVisible
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gray-800 hover:bg-gray-700 text-white"
        }`}
        title={isVisible ? "Hide Debug Panel" : "Show Debug Panel"}
      >
        {isVisible ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Bug className="w-5 h-5" />
        )}
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div
          className={`fixed z-[60] w-80 max-h-[80vh] bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden transition-all duration-200 ${
            isDragging ? "cursor-grabbing scale-105" : "cursor-auto"
          }`}
          style={{
            left: position.x,
            top: position.y,
            animation: isVisible ? "fadeInSlide 0.3s ease-out" : undefined,
          }}
        >
          {/* Header */}
          <div
            className="bg-gray-800 text-white p-3 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                <div>
                  <span className="font-medium">🔧 Cycle Debug Panel</span>
                  <div className="text-xs text-gray-300">v1.0.0 • DEV MODE</div>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 max-h-[calc(75vh-60px)] overflow-y-auto space-y-2">
            <DebugSection
              title="State & Data"
              icon={<Target className="w-4 h-4 text-violet-600" />}
              defaultExpanded={true}
            >
              <StateViewer />
            </DebugSection>

            <DebugSection
              title="Performance"
              icon={<Zap className="w-4 h-4 text-yellow-600" />}
            >
              <PerformanceInfo />
            </DebugSection>

            <DebugSection
              title="Component Info"
              icon={<Settings className="w-4 h-4 text-blue-600" />}
            >
              <ComponentInfo />
            </DebugSection>

            <DebugSection
              title="Action Simulator"
              icon={<Clock className="w-4 h-4 text-green-600" />}
            >
              <ActionSimulator />
            </DebugSection>
          </div>
        </div>
      )}
    </>
  );
}
