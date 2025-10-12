import { FiTarget, FiUsers } from "react-icons/fi";

export function StrategicTips() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
          <FiTarget className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dicas Estratégicas para Maximizar seu XP
          </h2>
          <p className="text-gray-600">
            Estratégias personalizadas por tipo de profissional
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <FiTarget className="w-3 h-3 text-white" />
            </div>
            Para Individual Contributors
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <strong className="text-blue-900">
                1. Aproveite os Multiplicadores
              </strong>
              <p className="text-gray-700 text-sm mt-1">
                Ações de liderança por influência têm +30% XP. Um PDI ciclo
                completo vale 300 XP!
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <strong className="text-blue-900">
                2. Combine Desenvolvimento + Colaboração
              </strong>
              <p className="text-gray-700 text-sm mt-1">
                Foque em PDI mas ensine outros. Colaboração cross-team rende
                ciclo completo vale 300 XP!
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <strong className="text-blue-900">
                3. Lidere por Influência
              </strong>
              <p className="text-gray-700 text-sm mt-1">
                Facilite retrospectivas, compartilhe conhecimento e mentore
                colegas para maximizar multiplicadores de liderança.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
              <FiUsers className="w-3 h-3 text-white" />
            </div>
            Para Managers
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <strong className="text-green-900">
                1. Foque em Impacto Mensurável
              </strong>
              <p className="text-gray-700 text-sm mt-1">
                Melhorias de processo e metas de equipe têm multiplicador +100%.
                Documente os resultados!
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <strong className="text-green-900">
                2. Desenvolva Pessoas Ativamente
              </strong>
              <p className="text-gray-700 text-sm mt-1">
                Suporte performance de subordinados e coaching de carreira são
                suas fontes principais de XP.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <strong className="text-green-900">
                3. Continue seu Próprio PDI
              </strong>
              <p className="text-gray-700 text-sm mt-1">
                Não negligencie seu desenvolvimento pessoal - managers também
                precisam crescer continuamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
