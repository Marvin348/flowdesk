import type { TaskStatusDistributionItem } from "@/features/dashboard/mappers/mapTaskStatusDistribution";
import { EllipsisVertical } from "lucide-react";
import TaskStatusDistributionCard from "./TaskStatusDistributionCard";
import CardEmptyState from "@/shared/components/CardEmptyState";
import { ListChecks } from "lucide-react";

const TaskStatusDistribution = ({
  statusItems,
}: {
  statusItems: TaskStatusDistributionItem[];
}) => {
  const hasNoStatusData = statusItems.every((status) => status.value === 0);

  return (
    <section className="flex flex-col h-full p-4 border rounded-md">
      <div className="flex flex-col flex-1">
        {hasNoStatusData ? (
          <CardEmptyState
            icon={<ListChecks className="h-5 w-5" />}
            title="Noch keine Aufgaben"
            description="Lege Aufgaben an, um zu sehen, wie sie sich auf Offen, In Arbeit und Erledigt verteilen."
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-xl">Aufgabenverteilung</h3>
              <button>
                <EllipsisVertical strokeWidth={1} fill="black" />
              </button>
            </div>

            <div className="flex items-center gap-6">
              {statusItems.map((item) => (
                <TaskStatusDistributionCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
export default TaskStatusDistribution;
