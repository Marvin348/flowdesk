import type { TaskStatusDistributionItem } from "@/features/dashboard/mappers/mapTaskStatusDistribution";
import { ChartBar } from "lucide-react";
import TaskStatusDistributionCard from "@/features/dashboard/components/statusDistribution/TaskStatusDistributionCard";
import CardEmptyState from "@/shared/components/CardEmptyState";
import { ListChecks } from "lucide-react";
import DashboardCardHeader from "@/features/dashboard/components/DashboardCardHeader";

const TaskStatusDistribution = ({
  statusItems,
}: {
  statusItems: TaskStatusDistributionItem[];
}) => {
  const hasNoStatusData = statusItems.every((status) => status.value === 0);

  return (
    <section className="flex flex-col h-full p-4 bg-card border rounded-md">
      <DashboardCardHeader
        eyebrow="chart"
        title="Aufgabenverteilung"
        icon={<ChartBar className="size-5" />}
      />

      <div className="flex flex-col flex-1">
        {hasNoStatusData ? (
          <CardEmptyState
            icon={<ListChecks className="h-5 w-5" />}
            title="Noch keine Aufgaben"
            description="Lege Aufgaben an, um zu sehen, wie sie sich auf Offen, In Arbeit und Erledigt verteilen."
          />
        ) : (
          <>
            <div className="flex flex-col gap-6">
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
