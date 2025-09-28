import React, { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface CollapsibleSectionCardProps {
  icon: React.ComponentType<{ className?: string }> | (() => React.ReactNode);
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  subtle?: boolean;
  className?: string;
  defaultExpanded?: boolean;
  forceExpanded?: boolean;
  preview?: React.ReactNode;
}

export const CollapsibleSectionCard: React.FC<CollapsibleSectionCardProps> = ({
  icon,
  title,
  action,
  children,
  subtle = false,
  className = "",
  defaultExpanded = false,
  forceExpanded = false,
  preview,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Determinar se deve estar expandido
  const shouldBeExpanded = forceExpanded || isExpanded;

  // Função para alternar expansão
  const toggleExpanded = () => {
    if (!forceExpanded) {
      setIsExpanded(!isExpanded);
    }
  };

  // Renderizar o ícone da seção
  const renderIcon = () => {
    if (typeof icon === "function" && icon.length === 0) {
      // É uma função sem parâmetros (função de render)
      return (icon as () => React.ReactNode)();
    } else {
      // É um componente React
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-5 h-5" />;
    }
  };

  return (
    <section
      className={`rounded-2xl border border-surface-300 ${
        subtle ? "bg-white/90" : "bg-white"
      } shadow-sm ${className}`}
    >
      <header
        className="flex items-center justify-between p-5 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-3">
          {/* Ícone de expansão */}
          <button
            className={`text-gray-400 hover:text-gray-600 transition-colors ${
              forceExpanded ? "cursor-default opacity-50" : "cursor-pointer"
            }`}
            title={shouldBeExpanded ? "Colapsar" : "Expandir"}
            aria-label={shouldBeExpanded ? "Colapsar seção" : "Expandir seção"}
            disabled={forceExpanded}
          >
            {shouldBeExpanded ? (
              <FiChevronDown className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </button>

          <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-surface-300/60">
              {renderIcon()}
            </span>
            {title}
          </h2>
        </div>

        {action && (
          <div
            className="shrink-0"
            onClick={(e) => e.stopPropagation()} // Evita colapsar ao clicar nas ações
          >
            {action}
          </div>
        )}
      </header>

      {/* Preview quando colapsado */}
      {!shouldBeExpanded && preview && (
        <div className="px-5 pb-3">
          <div className="text-sm text-gray-600 border-t border-gray-100 pt-3">
            {preview}
          </div>
        </div>
      )}

      {/* Conteúdo colapsável com animação */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          shouldBeExpanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 space-y-4">{children}</div>
      </div>
    </section>
  );
};
