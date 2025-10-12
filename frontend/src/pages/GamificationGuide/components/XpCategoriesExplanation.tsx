import { FiInfo, FiCheckCircle } from "react-icons/fi";

export function XpCategoriesExplanation() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-300 p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
          <FiInfo className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Por que Organizamos o XP em Categorias?
        </h3>
      </div>

      {/* Esclarecimento Importante */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 mt-0.5 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <FiCheckCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-800 mb-2">
              💡 Importante: Você Recebe TODOS os Pontos!
            </h4>
            <p className="text-emerald-700 text-sm mb-2">
              <strong>As porcentagens NÃO reduzem seu XP!</strong> Milestone de
              100 XP = você ganha 100 XP completos. As categorias são apenas
              para <strong>organização e balanceamento</strong>, não descontos.
            </p>
            <div className="bg-white rounded-lg p-3 border border-emerald-200">
              <p className="text-xs text-emerald-600">
                <strong>Exemplo:</strong> Milestone (100 XP) + Mentoria (60 XP)
                + Melhoria de Processo (80 XP) ={" "}
                <strong>240 XP total no seu perfil!</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-5">
        <h4 className="font-medium text-gray-900">
          🎯 Propósito Real das Categorias:
        </h4>
        <p className="text-gray-700">
          As porcentagens servem para{" "}
          <strong>orientar o crescimento equilibrado</strong> e garantir que
          diferentes perfis profissionais tenham{" "}
          <strong>oportunidades equivalentes</strong> de ganhar XP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 rounded bg-indigo-600"></div>
            <h4 className="font-bold text-indigo-900">40% das Oportunidades</h4>
          </div>
          <h5 className="font-semibold text-gray-900 mb-2">
            Desenvolvimento Pessoal
          </h5>
          <p className="text-gray-600 text-sm mb-2">
            <strong>Para quê:</strong> Pessoas focadas em crescimento técnico
            têm um caminho claro através do próprio PDI.
          </p>
          <p className="text-indigo-700 text-xs font-medium">
            Evita que pessoas parem de se desenvolver ao ajudar outros
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 rounded bg-blue-600"></div>
            <h4 className="font-bold text-blue-900">35% das Oportunidades</h4>
          </div>
          <h5 className="font-semibold text-gray-900 mb-2">
            Colaboração & Mentoring
          </h5>
          <p className="text-gray-600 text-sm mb-2">
            <strong>Para quê:</strong> Pessoas que gostam de ensinar têm o maior
            conjunto de oportunidades de XP.
          </p>
          <p className="text-blue-700 text-xs font-medium">
            Torna colaboração uma prioridade, não "trabalho extra"
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 rounded bg-green-600"></div>
            <h4 className="font-bold text-green-900">25% das Oportunidades</h4>
          </div>
          <h5 className="font-semibold text-gray-900 mb-2">
            Contribuição de Equipe
          </h5>
          <p className="text-gray-600 text-sm mb-2">
            <strong>Para quê:</strong> Valoriza cidadania corporativa e
            melhorias sistêmicas.
          </p>
          <p className="text-green-700 text-xs font-medium">
            Nem todo mundo precisa ser líder, mas todos devem se importar com o
            coletivo
          </p>
        </div>
      </div>
    </div>
  );
}
