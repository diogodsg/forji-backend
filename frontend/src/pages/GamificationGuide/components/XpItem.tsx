interface XpItemProps {
  title: string;
  xpValue: string;
  description: string;
  example: string;
  gradient: string;
}

export function XpItem({
  title,
  xpValue,
  description,
  example,
  gradient,
}: XpItemProps) {
  return (
    <div
      className={`bg-gradient-to-r ${gradient} border border-indigo-200 rounded-xl p-4`}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {xpValue}
        </span>
      </div>
      <p className="text-gray-700 text-sm mb-3">
        <strong>Como funciona:</strong> {description}
      </p>
      <div className="bg-white rounded-lg p-3 border border-indigo-100">
        <p className="text-xs text-indigo-700">
          <strong>Exemplo:</strong> {example}
        </p>
      </div>
    </div>
  );
}
