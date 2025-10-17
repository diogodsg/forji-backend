import { ArrowLeft, Users } from "lucide-react";

interface TeamCreateViewProps {
  onBack: () => void;
}

export function TeamCreateView({ onBack }: TeamCreateViewProps) {
  const handleCreate = () => {
    console.log("Create team");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 -m-6 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 border border-transparent hover:border-surface-300"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Nova Equipe
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Crie uma nova equipe e comece a gerenciar seus membros
            </p>
          </div>
        </div>

        {/* Formulário de criação */}
        <div className="bg-gradient-to-br from-white to-surface-50 rounded-2xl border border-surface-300 shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Users className="w-5 h-5" />
              </div>
              Informações da Equipe
            </h2>
            <p className="text-brand-100 text-sm mt-1">
              Preencha os dados básicos da nova equipe
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome da Equipe *
              </label>
              <input
                type="text"
                placeholder="Ex: Frontend, Backend, DevOps..."
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Escolha um nome claro e descritivo para a equipe
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                placeholder="Descreva o propósito, responsabilidades e objetivos da equipe..."
                rows={4}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200 text-sm resize-none"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Opcional: Ajuda outros membros a entender o papel da equipe
              </p>
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent my-6"></div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold text-sm h-11 px-5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-brand-400 focus:outline-none"
              >
                <Users className="w-4 h-4" />
                Criar Equipe
              </button>
              <button
                onClick={onBack}
                className="px-5 h-11 text-gray-600 hover:bg-surface-100 rounded-lg font-semibold text-sm transition-all duration-200 border border-surface-300 hover:border-surface-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="w-5 h-5 bg-brand-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-brand-900 mb-1">
                Próximos Passos
              </p>
              <p className="text-sm text-brand-700">
                Após criar a equipe, você poderá adicionar membros e designar
                líderes na tela de edição.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
