import {
  Target,
  CheckCircle2,
  TrendingUp,
  Calendar,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function SMARTGuide() {
  const smartItems = [
    {
      icon: CheckCircle2,
      letter: "S",
      title: "Específica",
      description: "Seja claro e objetivo",
    },
    {
      icon: BarChart3,
      letter: "M",
      title: "Mensurável",
      description: "Defina números claros",
    },
    {
      icon: TrendingUp,
      letter: "A",
      title: "Atingível",
      description: "Desafiadora mas possível",
    },
    {
      icon: Target,
      letter: "R",
      title: "Relevante",
      description: "Alinhada aos objetivos",
    },
    {
      icon: Calendar,
      letter: "T",
      title: "Temporal",
      description: "Com prazo definido",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-indigo-900">Guia SMART</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span className="text-xs text-indigo-700 font-medium">
            Descrições +100 caracteres ganham +8 XP!
          </span>
        </div>
      </div>

      {/* Grid de itens SMART em colunas */}
      <div className="grid grid-cols-5 gap-2.5">
        {smartItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.letter}
              className="bg-white/70 rounded-lg p-2.5 text-center"
            >
              <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Icon className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="mb-1">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                  {item.letter}
                </span>
              </div>
              <h4 className="font-semibold text-xs text-indigo-900 mb-0.5">
                {item.title}
              </h4>
              <p className="text-[10px] text-gray-700 leading-tight">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
