import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { MyPrsPage } from "./pages/MyPrsPage";
import { ManagerPrsPage } from "./pages/ManagerPrsPage";
import { MyPdiPage } from "./pages/MyPdiPage";

export default function App() {
  return (
    <BrowserRouter>
  <div className="min-h-full flex flex-col bg-surface-100 text-gray-800">
        <Header />
        <main className="flex-1 relative">
          <div className="pointer-events-none select-none opacity-60 absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,#c7d2fe,transparent_60%)]" />
          <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-8">
            <Routes>
              <Route path="/" element={<MyPrsPage />} />
              <Route path="/me/prs" element={<MyPrsPage />} />
              <Route path="/me/pdi" element={<MyPdiPage />} />
              <Route path="/users/:userId/prs" element={<ManagerPrsPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function Header() {
  const base = "px-3 py-2 rounded text-sm font-medium";
  return (
    <header className="border-b border-surface-300/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-6 h-14">
        <span className="font-bold bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 bg-clip-text text-transparent tracking-wide text-lg">
          forge
        </span>
        <nav className="flex items-center gap-2">
          <NavLink
            to="/me/prs"
            className={({ isActive }) =>
              `${base} ${
                isActive
                  ? "bg-indigo-600 text-white shadow-soft"
                  : "text-gray-600 hover:bg-surface-200"
              }`
            }
          >
            Meus PRs
          </NavLink>
          <NavLink
            to="/me/pdi"
            className={({ isActive }) =>
              `${base} ${
                isActive
                  ? "bg-indigo-600 text-white shadow-soft"
                  : "text-gray-600 hover:bg-surface-200"
              }`
            }
          >
            Meu PDI
          </NavLink>
          <NavLink
            to="/users/123/prs"
            className={({ isActive }) =>
              `${base} ${
                isActive
                  ? "bg-indigo-600 text-white shadow-soft"
                  : "text-gray-600 hover:bg-surface-200"
              }`
            }
          >
            Manager View
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-surface-300/70 text-xs text-gray-500 bg-white/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
        <span>forge · MVP</span>
        <span>v0.0.1</span>
      </div>
    </footer>
  );
}
