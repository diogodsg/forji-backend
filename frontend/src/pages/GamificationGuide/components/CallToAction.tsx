export function CallToAction() {
  return (
    <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-6 text-center text-white">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
          <div className="text-2xl">🚀</div>
        </div>
      </div>
      <h3 className="text-2xl font-semibold mb-4">
        Pronto para Começar sua Jornada Team-First?
      </h3>
      <p className="text-lg text-brand-100 mb-6">
        Junte-se ao movimento de crescimento colaborativo e veja como sua
        carreira e a de seus colegas podem florescer juntas.
      </p>
      <div className="flex justify-center gap-4">
        <button className="bg-white text-brand-600 px-5 py-2.5 rounded-lg font-medium hover:bg-brand-50 transition-colors">
          Ver Meu PDI
        </button>
        <button className="bg-brand-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-800 transition-colors">
          Acessar Leaderboard
        </button>
      </div>
    </div>
  );
}
