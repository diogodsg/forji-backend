import { ArrowLeft, Edit3 } from "lucide-react";

/**
 * Header específico para a página de edição de PDI
 */
export function PDIEditHeader({
  subordinate,
  onBack,
}: {
  subordinate: any;
  onBack: () => void;
}) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800 tracking-tight">
              Editando PDI - {subordinate?.name}
            </h1>
            <p className="text-green-700">
              Gerencie o Plano de Desenvolvimento Individual do seu subordinado
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>
    </div>
  );
}
