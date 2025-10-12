import { FiZap, FiTarget, FiTrendingUp, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface PdiMotivationBannerProps {
  className?: string;
}

export function PdiMotivationBanner({
  className = "",
}: PdiMotivationBannerProps) {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div
      className={`bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 rounded-lg p-4 border border-purple-100 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
            <FiZap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              Ganhe XP completando seus objetivos!
            </h3>
            <p className="text-sm text-gray-600">
              Cada milestone completado = +100 XP{" "}
              <FiTarget className="w-4 h-4 inline text-blue-600" />
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-purple-600">
              <FiTarget className="w-4 h-4" />
              <span className="font-medium">+100 XP</span>
              <span className="text-gray-500">por milestone</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600">
              <FiTrendingUp className="w-4 h-4" />
              <span className="font-medium">+50 XP</span>
              <span className="text-gray-500">bonus primeira vez</span>
            </div>
          </div>

          <button
            onClick={handleGoToHome}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 shadow-sm"
          >
            <FiHome className="w-4 h-4" />
            <span className="text-sm font-medium">Ver Dashboard</span>
          </button>
        </div>
      </div>

      {/* Mobile version */}
      <div className="sm:hidden mt-3 flex justify-between items-center">
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-purple-600">
            <FiTarget className="w-4 h-4" />
            <span className="font-medium">+100 XP por milestone</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-600">
            <FiTrendingUp className="w-4 h-4" />
            <span className="font-medium">+50 XP bonus</span>
          </div>
        </div>

        <button
          onClick={handleGoToHome}
          className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 shadow-sm"
        >
          <FiHome className="w-4 h-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </button>
      </div>
    </div>
  );
}
