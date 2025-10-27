import { useCycleManager } from "../../../hooks";

export function ActionSimulator() {
  const { cycle, goals, actions } = useCycleManager();

  const simulateActions = [
    {
      name: "🎯 Update Goal",
      action: () => {
        if (goals?.[0]) {
          const goal = goals[0];
          if (goal.type === "INCREASE" || goal.type === "PERCENTAGE") {
            const newValue = Math.floor(
              Math.random() * (goal.targetValue || 5)
            );
            actions.updateGoalProgress(goal.id, { newValue: newValue });
            console.log(
              `Debug: Updated goal "${goal.title}" to ${newValue}/${goal.targetValue}`
            );
          }
        }
      },
    },
    {
      name: "🔄 Complete Goal",
      action: () => {
        if (goals?.length) {
          const randomGoal = goals[Math.floor(Math.random() * goals.length)];
          if (randomGoal.type === "BINARY") {
            actions.updateGoalProgress(randomGoal.id, { newValue: 1 });
            console.log(`Debug: Completed goal "${randomGoal.title}"`);
          } else if (
            randomGoal.type === "INCREASE" ||
            randomGoal.type === "PERCENTAGE"
          ) {
            actions.updateGoalProgress(randomGoal.id, {
              newValue: randomGoal.targetValue,
            });
            console.log(`Debug: Completed quantity goal "${randomGoal.title}"`);
          }
        }
      },
    },
    {
      name: "📊 Log State",
      action: () => {
        console.group("🐛 Cycle Debug State");
        console.log("Current Cycle:", cycle);
        console.log("Goals Count:", goals?.length || 0);
        console.groupEnd();
      },
    },
    {
      name: "🧹 Clear Console",
      action: () => {
        console.clear();
        console.log("🐛 Console cleared at", new Date().toLocaleTimeString());
      },
    },
    {
      name: "🚨 Test Error",
      action: () => {
        try {
          throw new Error("Debug test error - intentional!");
        } catch (error) {
          console.error("Debug Error Test:", error);
        }
      },
    },
    {
      name: "📱 Viewport Info",
      action: () => {
        console.log("Viewport:", {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
        });
      },
    },
  ];

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700 mb-2">Action Simulator</h4>
      <div className="text-xs text-gray-500 mb-2 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
        ⚠️ Test actions (check console for logs)
      </div>
      <div className="grid grid-cols-2 gap-1">
        {simulateActions.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="text-left p-2 bg-blue-50 hover:bg-blue-100 rounded border text-xs text-blue-700 transition-colors font-mono"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
