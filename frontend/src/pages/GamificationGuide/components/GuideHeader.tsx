import { FiUsers } from "react-icons/fi";

export function GuideHeader() {
  return (
    <header className="pb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
          <FiUsers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Team-First Growth System
          </h1>
          <p className="text-gray-600">
            Sistema revolucionário de crescimento colaborativo
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          Descubra como nossa plataforma revoluciona o crescimento profissional
          com foco em
          <strong className="text-blue-600">
            {" "}
            colaboração sobre competição
          </strong>
          , criando um ambiente onde o sucesso individual é amplificado pelo
          sucesso coletivo.
        </p>
      </div>
    </header>
  );
}
