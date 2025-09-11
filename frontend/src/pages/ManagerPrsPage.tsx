import { MyPrsPage } from "./MyPrsPage";

// For MVP reuse component but could inject user context later
export function ManagerPrsPage() {
  return (
    <div>
      <div className="bg-indigo-600/10 border-b border-indigo-700/30 px-6 py-3">
        <h2 className="text-sm text-indigo-300">
          Visualizando PRs de:{" "}
          <span className="font-semibold text-indigo-200">dev-mock</span>
        </h2>
      </div>
      <MyPrsPage />
    </div>
  );
}
