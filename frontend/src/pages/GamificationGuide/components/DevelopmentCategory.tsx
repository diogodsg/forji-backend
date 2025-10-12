import { FiBook } from "react-icons/fi";
import { XpCategory } from "./XpCategory";
import { XpItem } from "./XpItem";

export function DevelopmentCategory() {
  return (
    <XpCategory
      title="Desenvolvimento Pessoal"
      percentage="40% do XP total"
      description="Foco no seu crescimento individual"
      icon={<FiBook className="w-8 h-8" />}
      gradient="from-brand-600 to-purple-600"
    >
      <XpItem
        title="Milestone PDI Completada"
        xpValue="100 XP"
        description="Quando você marca uma milestone como concluída no seu PDI, o sistema automaticamente credita XP. Cada milestone representa um marco importante no seu desenvolvimento."
        example='"Completar curso de React" → Marcar como concluída → 100 XP automático'
        gradient="from-brand-50 to-purple-50"
      />

      <XpItem
        title="Key Result Alcançado"
        xpValue="150 XP"
        description="Key Results são métricas mensuráveis dentro dos seus OKRs. Quando você atinge 100% de um KR, recebe XP automaticamente pelo impacto alcançado."
        example='"Reduzir bugs em 50%" → Atingir 50% de redução → 150 XP automático'
        gradient="from-brand-50 to-purple-50"
      />

      <XpItem
        title="Competência Level Up"
        xpValue="75 XP"
        description="Quando você evolui o nível de uma competência no PDI (ex: de Intermediário para Avançado), o sistema detecta e credita XP pelo crescimento."
        example="JavaScript: Intermediário → Avançado → 75 XP automático"
        gradient="from-brand-50 to-purple-50"
      />

      <XpItem
        title="Ciclo PDI Completo"
        xpValue="300 XP"
        description="Ao finalizar um ciclo completo do PDI (conclusão de todas as etapas planejadas), você recebe uma bonificação significativa pelo comprometimento."
        example="Finalizar PDI Q4 com todas as metas → 300 XP de bônus"
        gradient="from-brand-50 to-purple-50"
      />

      <XpItem
        title="Auto-avaliação Profunda"
        xpValue="50 XP"
        description="Auto-avaliações detalhadas e reflexivas demonstram maturidade profissional e autoconhecimento, elementos essenciais para crescimento."
        example="Auto-avaliação com análise de competências e planos de melhoria → 50 XP"
        gradient="from-brand-50 to-purple-50"
      />

      <XpItem
        title="Meta de Aprendizado"
        xpValue="60 XP"
        description="Definir e alcançar metas específicas de aprendizado mostra proatividade e foco no desenvolvimento contínuo."
        example='"Aprender Docker até fim do mês" → Meta atingida → 60 XP'
        gradient="from-indigo-50 to-purple-50"
      />

      <XpItem
        title="Reunião PDI Documentada"
        xpValue="40 XP"
        description="Participar de reuniões estruturadas de PDI com documentação adequada garante alinhamento e acompanhamento do progresso."
        example="Reunião mensal de PDI com manager documentada → 40 XP"
        gradient="from-indigo-50 to-purple-50"
      />
    </XpCategory>
  );
}
