import { LoginForm } from "@/features/auth";
/**
 * LoginPage
 *
 * Public unauthenticated entry point. Presents brand/marketing context on the left
 * (desktop and larger screens) and the login form on the right. Portuguese copy kept
 * intentionally; technical documentation remains in English.
 *
 * UX Notes:
 * - Background uses subtle gradient + radial accents for visual depth.
 * - Marketing panel hidden on small screens to prioritize authentication.
 * - Version tag (MVP) displayed for transparency of product maturity.
 */

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-surface-100 to-surface-200" />
      <div className="pointer-events-none select-none opacity-70 absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#c7d2fe,transparent_60%)]" />
      <div className="pointer-events-none select-none opacity-60 absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,#e0f2fe,transparent_55%)]" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Painel de identidade / marketing */}
          <div className="md:col-span-3 space-y-6 hidden md:block">
            <div className="flex items-center gap-3">
              <img
                src="/logo-forge.webp"
                alt="Forge"
                className="w-14 h-14 rounded-lg shadow-sm"
              />
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 bg-clip-text text-transparent">
                    Forge
                  </span>
                </h1>
                <p className="mt-1 text-[13px] font-medium text-indigo-600/80 tracking-wide">
                  Forjando talentos, moldando times
                </p>
              </div>
            </div>
            <p className="text-gray-600 max-w-md text-sm leading-relaxed">
              Acompanhe Pull Requests, estruture seu PDI, defina milestones e
              Key Results, registre evolução por competência e visualize o
              progresso da sua equipe — tudo em um só lugar.
            </p>
            <ul className="text-xs text-gray-600 space-y-1 font-medium">
              <li>• Lista de PRs com detalhes e status</li>
              <li>• Plano de desenvolvimento com milestones e tarefas</li>
              <li>• Key Results e registros de evolução</li>
              <li>• Visão de manager para acompanhar subordinados</li>
            </ul>
            <div className="pt-4 text-[10px] uppercase tracking-wider text-gray-400 font-medium">
              v0.0.1 MVP
            </div>
          </div>

          {/* Card de login */}
          <div className="md:col-span-2 relative group">
            <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-br from-indigo-400/50 via-indigo-300/40 to-sky-300/40 opacity-0 group-hover:opacity-100 blur transition" />
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
