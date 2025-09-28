import { Link } from "react-router-dom";
/**
 * NotFoundPage
 *
 * Simple 404 boundary for unmatched routes. Keeps Portuguese copy while code comments
 * / documentation stay in English. Provides a call-to-action back to the PDI page.
 */

export function NotFoundPage() {
  return (
    <div className="p-10 flex flex-col items-center text-center gap-4">
      <div className="text-6xl font-bold text-indigo-600">404</div>
      <h1 className="text-xl font-semibold text-gray-800">
        Página não encontrada
      </h1>
      <p className="text-sm text-gray-500 max-w-sm">
        O recurso que você tentou acessar não existe ou foi movido.
      </p>
      <Link
        to="/me/pdi"
        className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow"
      >
        Ir para meu PDI
      </Link>
    </div>
  );
}
