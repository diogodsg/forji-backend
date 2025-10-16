import { useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface ListEditorProps {
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  color: "blue" | "emerald" | "amber";
}

export default function ListEditor({
  items,
  onAdd,
  onRemove,
  placeholder,
  color,
}: ListEditorProps) {
  const [inputValue, setInputValue] = useState("");

  const colorClasses = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
        />
        <button
          onClick={handleAdd}
          type="button"
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          +
        </button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${colorClasses[color]}`}
            >
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="flex-1 text-sm">{item}</span>
              <button
                onClick={() => onRemove(index)}
                type="button"
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
