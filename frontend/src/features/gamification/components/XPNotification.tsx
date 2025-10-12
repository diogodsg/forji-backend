import { useEffect, useState } from "react";
import { FiStar, FiZap, FiX, FiAward } from "react-icons/fi";

interface XPNotificationProps {
  xpGained: number;
  action: string;
  onClose: () => void;
  levelUp?: {
    newLevel: number;
    title: string;
  };
  badgeUnlocked?: {
    id: string;
    name: string;
    rarity: "common" | "rare" | "epic" | "legendary";
  };
}

export function XPNotification({
  xpGained,
  action,
  onClose,
  levelUp,
  badgeUnlocked,
}: XPNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-purple-500 to-pink-500";
      case "epic":
        return "from-purple-400 to-blue-500";
      case "rare":
        return "from-blue-400 to-cyan-500";
      default:
        return "from-green-400 to-blue-500";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-80 max-w-sm">
        {/* Header com botão close */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FiZap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">+{xpGained} XP</p>
              <p className="text-sm text-gray-600 capitalize">
                {action.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Level Up notification */}
        {levelUp && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-3 mb-3">
            <div className="flex items-center text-white">
              <FiStar className="w-5 h-5 mr-2" />
              <div>
                <p className="font-bold">Level Up!</p>
                <p className="text-sm opacity-90">
                  Level {levelUp.newLevel} - {levelUp.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Badge unlocked notification */}
        {badgeUnlocked && (
          <div
            className={`bg-gradient-to-r ${getRarityColor(
              badgeUnlocked.rarity
            )} rounded-lg p-3`}
          >
            <div className="flex items-center text-white">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <FiAward className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-bold">Badge Unlocked!</p>
                <p className="text-sm opacity-90">{badgeUnlocked.name}</p>
                <p className="text-xs opacity-75 capitalize">
                  {badgeUnlocked.rarity}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar animation */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
