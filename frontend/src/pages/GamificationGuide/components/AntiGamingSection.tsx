import { FiShield } from "react-icons/fi";

export function AntiGamingSection() {
  return (
    <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <FiShield className="w-3 h-3 text-white" />
        </div>
        O que NÃO Fazer (Anti-Gaming)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-red-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <strong className="text-gray-900">Não faça feedbacks vazios</strong>
          <p className="text-gray-600 text-sm mt-1">
            Feedbacks precisam ser úteis (≥4.0/5) e ter cooldown de 72h por
            pessoa.
          </p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-red-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <strong className="text-gray-900">Não abuse dos caps</strong>
          <p className="text-gray-600 text-sm mt-1">
            Máximo 5 feedbacks e 3 mentorias por semana. Qualidade &gt;
            quantidade.
          </p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-red-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <strong className="text-gray-900">Não documente falsamente</strong>
          <p className="text-gray-600 text-sm mt-1">
            Todas as ações precisam de evidências e validação por pares.
          </p>
        </div>
      </div>
    </div>
  );
}
