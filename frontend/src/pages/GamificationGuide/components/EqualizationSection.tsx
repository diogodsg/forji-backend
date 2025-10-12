import { FiCheckCircle, FiTarget, FiUsers, FiStar } from "react-icons/fi";

export function EqualizationSection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <FiCheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Equalização IC vs Manager: Como Garantimos Justiça
          </h2>
          <p className="text-gray-600">
            Sistema automático que equilibra oportunidades de XP entre perfis
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-6">
          <p className="text-gray-700">
            <strong>O Problema:</strong> Managers naturalmente têm mais
            oportunidades de XP em "Colaboração" e "Equipe" por sua posição. ICs
            poderiam ficar em desvantagem na competição injusta.
          </p>
        </div>

        {/* Como o Sistema Resolve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <FiTarget className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Individual Contributors (ICs)
              </h3>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">
                  Multiplicador de Liderança por Influência
                </h4>
                <p className="text-blue-700 text-sm mb-2">
                  <strong>+30% XP</strong> em ações de liderança sem cargo
                  formal
                </p>
                <div className="text-blue-600 text-sm space-y-1">
                  <div>
                    • Facilitar retrospectivas: 26 XP → <strong>33,8 XP</strong>
                  </div>
                  <div>
                    • Mentoria técnica: 40 XP → <strong>52 XP</strong>
                  </div>
                  <div>
                    • Compartilhamento de conhecimento: 30 XP →{" "}
                    <strong>39 XP</strong>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-bold text-indigo-900 mb-2">
                  Bônus de Excelência Técnica
                </h4>
                <p className="text-indigo-700 text-sm mb-2">
                  Reconhecimento ampliado por inovação e qualidade
                </p>
                <div className="text-indigo-600 text-sm space-y-1">
                  <div>
                    • Soluções inovadoras: até <strong>100 XP</strong>
                  </div>
                  <div>
                    • Melhorias de arquitetura: <strong>60-80 XP</strong>
                  </div>
                  <div>
                    • Contribuições open-source: <strong>40-60 XP</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                <FiUsers className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Managers</h3>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">
                  Multiplicador de Impacto
                </h4>
                <p className="text-green-700 text-sm mb-2">
                  <strong>+100% XP</strong> em melhorias de processo com impacto
                  mensurável
                </p>
                <div className="text-green-600 text-sm space-y-1">
                  <div>
                    • Redução de bugs em 20%: 50 XP → <strong>100 XP</strong>
                  </div>
                  <div>
                    • Melhoria de velocity: 40 XP → <strong>80 XP</strong>
                  </div>
                  <div>
                    • Otimização de deploys: 60 XP → <strong>120 XP</strong>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-bold text-emerald-900 mb-2">
                  Foco em Desenvolvimento de Pessoas
                </h4>
                <p className="text-emerald-700 text-sm mb-2">
                  Oportunidades exclusivas de alto impacto
                </p>
                <div className="text-emerald-600 text-sm space-y-1">
                  <div>
                    • Coaching de carreira: <strong>80 XP</strong>
                  </div>
                  <div>
                    • Suporte de performance: <strong>60 XP</strong>
                  </div>
                  <div>
                    • Desenvolvimento de lideranças: <strong>100 XP</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Limitações Balanceadas */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-lg bg-amber-600 flex items-center justify-center">
              <FiStar className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">
              Limitações que Equilibram o Sistema
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">
                Para Managers:
              </h4>
              <div className="text-amber-700 text-sm space-y-1">
                <div>
                  •{" "}
                  <strong>
                    Menos oportunidades de desenvolvimento técnico
                  </strong>{" "}
                  (foco em gestão)
                </div>
                <div>
                  • Resultados dependem da{" "}
                  <strong>performance da equipe</strong>
                </div>
                <div>
                  • Multiplicadores só aplicam com{" "}
                  <strong>evidência de impacto</strong>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Para ICs:</h4>
              <div className="text-amber-700 text-sm space-y-1">
                <div>
                  • <strong>Precisam demonstrar liderança</strong> sem
                  autoridade formal
                </div>
                <div>
                  • Multiplicadores requerem{" "}
                  <strong>reconhecimento de pares</strong>
                </div>
                <div>
                  • Limitações em ações de{" "}
                  <strong>impacto organizacional</strong> direto
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exemplos Práticos */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center">
              <FiStar className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">
              Potencial de XP por Perfil (Mensal)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <FiTarget className="w-4 h-4" />
                IC Senior Ativo
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">PDI + multiplicador:</span>
                  <span className="font-bold text-blue-900">130 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Mentoria (4x):</span>
                  <span className="font-bold text-blue-900">208 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">
                    Facilitation + tech talks:
                  </span>
                  <span className="font-bold text-blue-900">92 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Inovação técnica:</span>
                  <span className="font-bold text-blue-900">100 XP</span>
                </div>
                <hr className="border-blue-200" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-blue-800">Total Mensal:</span>
                  <span className="font-bold text-blue-900">530 XP</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <FiUsers className="w-4 h-4" />
                Manager Engajado
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">PDI pessoal:</span>
                  <span className="font-bold text-green-900">100 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">
                    Desenvolvimento de pessoas:
                  </span>
                  <span className="font-bold text-green-900">240 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">
                    Processo + multiplicador:
                  </span>
                  <span className="font-bold text-green-900">160 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">
                    Colaboração cross-team:
                  </span>
                  <span className="font-bold text-green-900">90 XP</span>
                </div>
                <hr className="border-green-200" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-green-800">
                    Total Mensal:
                  </span>
                  <span className="font-bold text-green-900">590 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-green-600 flex items-center justify-center">
              <FiCheckCircle className="w-4 h-4 text-white" />
            </div>
            Resultado da Equalização
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            <strong>
              Ambos os perfis têm potencial XP similar (500-600 XP/mês):
            </strong>{" "}
            ICs através de excelência técnica, liderança por influência e
            multiplicadores de inovação. Managers através de impacto em
            processos, desenvolvimento de pessoas e multiplicadores
            organizacionais. O sistema recompensa diferentes tipos de
            contribuição de forma equilibrada, garantindo que
            <strong> nenhum perfil tenha vantagem estrutural injusta</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
