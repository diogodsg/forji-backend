import { FiZap, FiStar } from "react-icons/fi";
import {
  GuideHeader,
  TeamFirstPhilosophy,
  XpCategoriesExplanation,
  DevelopmentCategory,
  CollaborationCategory,
  TeamContributionCategory,
  XpCategory,
  StrategicTips,
  AntiGamingSection,
  EqualizationSection,
  CallToAction,
} from "./components";

export function GamificationGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="space-y-6">
          <GuideHeader />

          <TeamFirstPhilosophy />

          {/* Sistema de XP Completo com Explicações Detalhadas */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
                <FiZap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  Como Ganhar XP - Sistema Completo
                </h2>
                <p className="text-gray-600">
                  Todas as formas de crescimento e seus critérios
                </p>
              </div>
            </div>

            <XpCategoriesExplanation />

            <DevelopmentCategory />

            <CollaborationCategory />

            <TeamContributionCategory />

            {/* Bônus Especiais e Atividades Extras */}
            <XpCategory
              title="Bônus Especiais & Atividades Extras"
              percentage="XP adicional"
              description="por excelência e engajamento"
              icon={<FiStar className="w-8 h-8" />}
              gradient="from-purple-600 to-pink-600"
            >
              {/* Reconhecimento por Pares */}
              <div className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-purple-800">
                    Reconhecimento por Pares
                  </h4>
                  <span className="font-bold text-purple-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    25 XP
                  </span>
                </div>
                <p className="text-purple-700 text-sm mb-2">
                  <strong>Como funciona:</strong> Receber reconhecimento público
                  de colegas por contribuição especial, seja técnica, cultural
                  ou de liderança.
                </p>
                <div className="bg-white p-3 rounded border border-purple-200">
                  <p className="text-xs text-purple-600">
                    <strong>Exemplo:</strong> "Shoutout" em reunião de equipe
                    por ajuda excepcional → 25 XP
                  </p>
                </div>
              </div>

              {/* Inovação */}
              <div className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-purple-800">Inovação</h4>
                  <span className="font-bold text-purple-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    100 XP
                  </span>
                </div>
                <p className="text-purple-700 text-sm mb-2">
                  <strong>Como funciona:</strong> Implementar solução criativa
                  que gere impacto significativo em produtividade, qualidade ou
                  experiência do usuário.
                </p>
                <div className="bg-white p-3 rounded border border-purple-200">
                  <p className="text-xs text-purple-600">
                    <strong>Validação:</strong> Impacto confirmado por métricas
                    objetivas ou avaliação da liderança
                  </p>
                </div>
              </div>

              {/* Atividades de Engajamento */}
              <div className="border-l-4 border-gray-400 pl-4 py-3 bg-gray-50 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-700">
                    Atividades de Engajamento
                  </h4>
                  <span className="font-bold text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    5-20 XP
                  </span>
                </div>
                <p className="text-gray-700 text-sm">
                  <strong>Como funciona:</strong> Participação em eventos da
                  empresa, palestras externas, contribuições para comunidade
                  técnica ou iniciativas de diversidade e inclusão.
                </p>
              </div>
            </XpCategory>
          </div>

          <StrategicTips />

          <AntiGamingSection />

          <EqualizationSection />

          <CallToAction />
        </div>
      </div>
    </div>
  );
}
