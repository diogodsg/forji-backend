import { FiTarget, FiCheckCircle } from "react-icons/fi";

export function TeamFirstPhilosophy() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
          <FiTarget className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Por que Team-First?
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="font-bold text-red-700 mb-4 text-lg flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Ranking Individual (Tradicional)
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-red-500 mt-1">•</span>
              <span>
                <strong>Competição tóxica</strong> entre colegas que prejudica
                relacionamentos
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 mt-1">•</span>
              <span>
                <strong>Silos e isolamento</strong> com pessoas guardando
                conhecimento
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 mt-1">•</span>
              <span>
                <strong>Pressão psicológica</strong> prejudicial ao bem-estar
                mental
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 mt-1">•</span>
              <span>
                <strong>Foco em métricas vazias</strong> em vez de crescimento
                real
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 mt-1">•</span>
              <span>
                <strong>Gaming do sistema</strong> para ganhar pontos sem valor
              </span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-green-700 mb-4 text-lg flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <FiCheckCircle className="w-3 h-3 text-white" />
            </div>
            Ranking de Equipes (Team-First)
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">•</span>
              <span>
                <strong>Colaboração genuína</strong> e crescimento conjunto
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">•</span>
              <span>
                <strong>Mentoria incentivada</strong> generosamente recompensada
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">•</span>
              <span>
                <strong>Diversidade valorizada</strong> com diferentes tipos de
                contribuição
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">•</span>
              <span>
                <strong>Ambiente saudável</strong> sem comparações prejudiciais
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">•</span>
              <span>
                <strong>Impacto real</strong> focado em desenvolvimento e
                resultados
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
