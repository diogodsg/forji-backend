export function AccessDeniedPanel() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 backdrop-blur border border-rose-200 rounded-xl p-6 text-center">
        <h2 className="text-xl font-semibold text-rose-700">Access denied</h2>
        <p className="text-sm text-rose-600 mt-1">
          This page is restricted to administrators.
        </p>
      </div>
    </div>
  );
}
