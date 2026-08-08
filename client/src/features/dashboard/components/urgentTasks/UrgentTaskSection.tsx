import type { DashboardUrgentTask } from "@shared/types/dto/dashboard/dashboardUrgentTasks.dto";
import UrgentTaskCard from "@/features/dashboard/components/urgentTasks/UrgentTaskCard";

type UrgentTaskSectionProps = {
  title: string;
  tasks: DashboardUrgentTask[];
  total: number;
};

const UrgentTaskSection = ({ title, tasks, total }: UrgentTaskSectionProps) => {
  const remainingCount = Math.max(total - tasks.length, 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 rounded-md px-4 py-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {total} insgesamt
          </p>
        </div>

        {remainingCount > 0 && (
          <span className="shrink-0 rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
            +{remainingCount} weitere
          </span>
        )}
      </div>

      <div className="rounded-md border bg-background">
        {tasks.length > 0 ? (
          <div className="divide-y">
            {tasks.map((task) => (
              <UrgentTaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-sm text-muted-foreground">
            Keine Aufgaben in diesem Bereich.
          </div>
        )}
      </div>
    </div>
  );
};
export default UrgentTaskSection;
