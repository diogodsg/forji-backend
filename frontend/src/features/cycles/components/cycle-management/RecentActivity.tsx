export function RecentActivity() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📈 Atividade Recente
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-700 flex-1">
            1:1 registrado com manager
          </span>
          <span className="text-xs text-gray-400">2d</span>
        </div>
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          <span className="text-gray-700 flex-1">
            Certificação AWS adicionada
          </span>
          <span className="text-xs text-gray-400">5d</span>
        </div>
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-gray-700 flex-1">Marco: Projeto entregue</span>
          <span className="text-xs text-gray-400">1w</span>
        </div>
      </div>
      <button className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 font-medium">
        Ver histórico completo →
      </button>
    </div>
  );
}
