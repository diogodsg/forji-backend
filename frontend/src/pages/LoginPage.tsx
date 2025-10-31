import { LoginForm } from "@/features/auth";
import { FiAward } from "react-icons/fi";

/**
 * LoginPage
 *
 * Public unauthenticated entry point with minimal design approach.
 * Left side (desktop) shows brand identity, right side shows login form.
 *
 * Design Philosophy:
 * - Minimal text, maximum focus on authentication
 * - Violet brand colors (Design System v2.4)
 * - Team-First messaging without overwhelming copy
 * - Clean, professional aesthetic
 */

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background base - Design System v2.4 (Violet) */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-surface-100 to-surface-200" />

      {/* Grid pattern sutil */}
      <div
        className="pointer-events-none select-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, rgb(124, 58, 237) 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Formas geométricas decorativas */}
      {/* Círculo superior esquerdo */}
      <div className="pointer-events-none select-none absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-brand-500/8 rounded-full blur-3xl" />

      {/* Círculo inferior direito */}
      <div className="pointer-events-none select-none absolute -bottom-40 -right-40 w-[48rem] h-[48rem] bg-brand-600/10 rounded-full blur-3xl" />

      {/* Quadrado rotacionado - canto superior direito */}
      <div className="pointer-events-none select-none absolute top-16 right-24 w-80 h-80 bg-brand-400/6 rounded-3xl blur-2xl rotate-12" />

      {/* Retângulo rotacionado - meio esquerda */}
      <div className="pointer-events-none select-none absolute top-1/3 -left-32 w-64 h-96 bg-brand-500/6 rounded-3xl blur-2xl -rotate-6" />

      {/* Radial gradients sutis */}
      <div className="pointer-events-none select-none opacity-50 absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.08),transparent_60%)]" />
      <div className="pointer-events-none select-none opacity-40 absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(139,92,246,0.06),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Painel de identidade minimalista */}
          <div className="space-y-8 hidden md:block">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-md transition-transform duration-150 group-hover:scale-105">
                <FiAward className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
                    Forji
                  </span>
                </h1>
                <p className="mt-0.5 text-sm font-medium text-brand-600/80 tracking-wide">
                  Team-First Growth System
                </p>
              </div>
            </div>

            {/* Tagline simples */}
            <p className="text-gray-600 text-base leading-relaxed max-w-sm">
              Sistema gamificado de PDI onde seu crescimento fortalece o time
              todo.
            </p>

            {/* Versão */}
            <div className="pt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                v0.0.1
              </span>
            </div>
          </div>

          {/* Card de login */}
          <div className="relative group">
            <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-br from-brand-400/50 via-brand-300/40 to-brand-200/30 opacity-0 group-hover:opacity-100 blur transition duration-300" />
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
