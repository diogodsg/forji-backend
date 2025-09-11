import { mockPdi } from "../mocks/pdi";
import { EditablePdiView } from "../components/EditablePdiView";

export function MyPdiPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Meu PDI</h1>
      <EditablePdiView initialPlan={mockPdi} />
    </div>
  );
}
