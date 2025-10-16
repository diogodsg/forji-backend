import { X } from "lucide-react";
import { useState } from "react";
import type { KeyboardEvent } from "react";

interface TagInputProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}

export default function TagInput({
  items,
  onAdd,
  onRemove,
  placeholder,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div>
      {/* Input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          Adicionar
        </button>
      </div>

      {/* Tags */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-gray-400 italic">
          Nenhum item adicionado ainda
        </p>
      )}
    </div>
  );
}
