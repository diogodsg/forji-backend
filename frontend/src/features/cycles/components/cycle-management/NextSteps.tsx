export function NextSteps() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">
        💡 Próximos Passos
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
            1
          </div>
          <div>
            <div className="font-medium text-blue-800 mb-1">
              Registre seu último 1:1
            </div>
            <div className="text-blue-600">
              Documente insights da conversa com seu manager
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
            2
          </div>
          <div>
            <div className="font-medium text-blue-800 mb-1">
              Atualizar progresso das metas
            </div>
            <div className="text-blue-600">
              Clique nas metas para registrar avanços
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
          <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
            3
          </div>
          <div>
            <div className="font-medium text-blue-800 mb-1">
              Registrar marco atingido
            </div>
            <div className="text-blue-600">
              Celebrate suas conquistas recentes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
