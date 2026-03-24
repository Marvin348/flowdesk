import type { TaskStatusDistributionItem } from "@/utils/dashboard/mapTaskStatusDistributionToItems";
import { Ellipsis } from "lucide-react";
import TaskStatusDistributionCard from "./TaskStatusDistributionCard";

const TaskStatusDistribution = ({
  statusItems,
}: {
  statusItems: TaskStatusDistributionItem[];
}) => {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-xl">Aufgabenverteilung</h3>
        <button>
          <Ellipsis />
        </button>
      </div>

      <div className="flex items-center">
        {statusItems.map((item) => (
          <TaskStatusDistributionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
export default TaskStatusDistribution;
