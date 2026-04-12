import type { TaskStatusDistributionItem } from "@/utils/dashboard/mapTaskStatusDistributionToItems";
import { EllipsisVertical } from "lucide-react";
import TaskStatusDistributionCard from "./TaskStatusDistributionCard";

const TaskStatusDistribution = ({
  statusItems,
}: {
  statusItems: TaskStatusDistributionItem[];
}) => {
  return (
    <section className="p-4 border rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-xl">Aufgabenverteilung</h3>
        <button>
          <EllipsisVertical strokeWidth={1} fill="black"/>
        </button>
      </div>

      <div className="flex items-center gap-6">
        {statusItems.map((item) => (
          <TaskStatusDistributionCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
export default TaskStatusDistribution;
