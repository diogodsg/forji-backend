import { FiTarget } from "react-icons/fi";
import { XpCategory } from "./XpCategory";

export function TeamContributionCategory() {
  return (
    <XpCategory
      title="Contribuição de Equipe"
      percentage="25% do XP total"
      description="Foco em impacto coletivo"
      icon={<FiTarget className="w-8 h-8" />}
      gradient="from-emerald-600 to-green-600"
    >
      {/* Melhoria de Processo */}
      <div className="border-l-4 border-emerald-500 pl-4 py-3 bg-emerald-50 rounded-r-lg">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-emerald-800">
            Melhoria de Processo
          </h4>
          <span className="font-semibold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
            120 XP
          </span>
        </div>
        <p className="text-emerald-700 text-sm mb-2">
          <strong>Como funciona:</strong> Identificar, propor e implementar
          melhoria em processo da equipe que gere impacto mensurável em
          produtividade, qualidade ou bem-estar.
        </p>
        <div className="bg-white p-3 rounded border border-emerald-200">
          <p className="text-xs text-emerald-600">
            <strong>Multiplicador Manager:</strong> +100% XP (120 → 240 XP) por
            responsabilidade de melhoria contínua
          </p>
        </div>
      </div>

      {/* Meta da Equipe */}
      <div className="border-l-4 border-emerald-500 pl-4 py-3 bg-emerald-50 rounded-r-lg">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-emerald-800">Meta da Equipe</h4>
          <span className="font-semibold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
            100 XP
          </span>
        </div>
        <p className="text-emerald-700 text-sm mb-2">
          <strong>Como funciona:</strong> Contribuir ativamente para alcançar
          objetivo coletivo da equipe, seja em produtividade, qualidade, ou
          indicadores de negócio.
        </p>
        <div className="bg-white p-3 rounded border border-emerald-200">
          <p className="text-xs text-emerald-600">
            <strong>Multiplicador Manager:</strong> +100% XP (100 → 200 XP) por
            responsabilidade de resultados
          </p>
        </div>
      </div>

      {/* Resolução de Conflito */}
      <div className="border-l-4 border-emerald-500 pl-4 py-3 bg-emerald-50 rounded-r-lg">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-emerald-800">
            Resolução de Conflito
          </h4>
          <span className="font-semibold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
            80 XP
          </span>
        </div>
        <p className="text-emerald-700 text-sm mb-2">
          <strong>Como funciona:</strong> Mediar e resolver conflito entre
          colegas de forma construtiva, restaurando colaboração e ambiente
          saudável na equipe.
        </p>
        <div className="bg-white p-3 rounded border border-emerald-200">
          <p className="text-xs text-emerald-600">
            <strong>Validação:</strong> Partes envolvidas confirmam resolução
            satisfatória ≥4.0/5
          </p>
        </div>
      </div>

      {/* Facilitar Retrospectiva */}
      <div className="border-l-4 border-emerald-500 pl-4 py-3 bg-emerald-50 rounded-r-lg">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-emerald-800">
            Facilitar Retrospectiva
          </h4>
          <span className="font-semibold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
            60 XP
          </span>
        </div>
        <p className="text-emerald-700 text-sm mb-2">
          <strong>Como funciona:</strong> Facilitar sessão de retrospectiva da
          equipe, criando ambiente seguro para feedback e gerando ações
          concretas de melhoria.
        </p>
        <div className="bg-white p-3 rounded border border-emerald-200">
          <p className="text-xs text-emerald-600">
            <strong>Multiplicador IC:</strong> +30% XP (60 → 78 XP) por
            liderança através de facilitação
          </p>
        </div>
      </div>

      {/* Cultura da Equipe */}
      <div className="border-l-4 border-emerald-500 pl-4 py-3 bg-emerald-50 rounded-r-lg">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-emerald-800">Cultura da Equipe</h4>
          <span className="font-semibold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
            50 XP
          </span>
        </div>
        <p className="text-emerald-700 text-sm mb-2">
          <strong>Como funciona:</strong> Iniciativa que fortalece cultura
          positiva da equipe: eventos de integração, rituais de celebração, ou
          práticas de bem-estar.
        </p>
        <div className="bg-white p-3 rounded border border-emerald-200">
          <p className="text-xs text-emerald-600">
            <strong>Validação:</strong> Equipe avalia impacto positivo na
            cultura ≥4.0/5
          </p>
        </div>
      </div>

      {/* Documentação Útil */}
      <div className="border-l-4 border-emerald-500 pl-4 py-3 bg-emerald-50 rounded-r-lg">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-emerald-800">Documentação Útil</h4>
          <span className="font-semibold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
            40 XP
          </span>
        </div>
        <p className="text-emerald-700 text-sm mb-2">
          <strong>Como funciona:</strong> Criar ou atualizar documentação que
          facilite o trabalho da equipe: processos, APIs, troubleshooting, ou
          conhecimento técnico.
        </p>
        <div className="bg-white p-3 rounded border border-emerald-200">
          <p className="text-xs text-emerald-600">
            <strong>Cooldown:</strong> 1 mês para documentação do mesmo tópico
          </p>
        </div>
      </div>
    </XpCategory>
  );
}
