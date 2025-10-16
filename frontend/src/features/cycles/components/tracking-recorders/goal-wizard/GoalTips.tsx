import { Lightbulb, Sparkles, TrendingUp } from "lucide-react";

export default function GoalTips() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-amber-600" />
        <h3 className="font-bold text-amber-900">Dicas de Ouro</h3>
      </div>

      <div className="space-y-3">
        {/* Dica 1 */}
        <div className="bg-white/60 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-amber-900 mb-1">
                Seja específico no título
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Use verbos de ação e números sempre que possível.
                <span className="block mt-1 text-amber-800 font-medium">
                  ✓ "Aumentar 1:1s de 2 para 5 por mês"
                </span>
                <span className="block text-gray-500">
                  ✗ "Melhorar comunicação"
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Dica 2 */}
        <div className="bg-white/60 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-amber-900 mb-1">
                Descrição rica ganha +8 XP
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Descrições com mais de 100 caracteres ganham bônus! Explique o
                contexto, por que essa meta é importante e como ela vai te
                ajudar a crescer.
              </p>
            </div>
          </div>
        </div>

        {/* Dica 3 */}
        <div className="bg-white/60 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">i</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-amber-900 mb-1">
                Escolha o tipo certo
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Cada tipo de meta tem um formulário específico no próximo passo.
                Escolha o que melhor representa seu objetivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
