interface CompetenciesPreviewProps {
  onViewAll: () => void;
}

export function CompetenciesPreview({ onViewAll }: CompetenciesPreviewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">🧠 Competências</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-violet-600 hover:text-violet-700 font-medium"
        >
          Ver todas →
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <span className="text-sm font-medium">Frontend Development</span>
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
            Nível 3
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <span className="text-sm font-medium">Team Leadership</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Nível 2
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <span className="text-sm font-medium">System Design</span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            Nível 1
          </span>
        </div>
      </div>
    </div>
  );
}
