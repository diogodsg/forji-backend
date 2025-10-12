export function CallToAction() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
          <div className="text-2xl mb-2">🚀</div>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">
        Pronto para Começar sua Jornada Team-First?
      </h3>
      <p className="text-xl text-blue-100 mb-6">
        Junte-se ao movimento de crescimento colaborativo e veja como sua
        carreira e a de seus colegas podem florescer juntas.
      </p>
      <div className="flex justify-center gap-4">
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Ver Meu PDI
        </button>
        <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
          Acessar Leaderboard
        </button>
      </div>
    </div>
  );
}
