import CardEmptyState from "@/shared/components/CardEmptyState";
import { AlertTriangle, CalendarClock } from "lucide-react";
import UrgentTaskSection from "@/features/dashboard/components/urgentTasks/UrgentTaskSection";
import type { DashboardUrgentTaskDto } from "@shared/types/dto/dashboard/dashboardUrgentTasks.dto";
import DashboardCardHeader from "@/features/dashboard/components/DashboardCardHeader";

type UrgentTasksProps = {
  urgentTasks: DashboardUrgentTaskDto;
};

const UrgentTasks = ({ urgentTasks }: UrgentTasksProps) => {
  const { dueThisWeek, overdue } = urgentTasks;
  return (
    <section className="flex h-full flex-col rounded-md border bg-card p-4">
      <DashboardCardHeader
        eyebrow="Fokus"
        title="Dringende Aufgaben"
        icon={<AlertTriangle className="size-5" />}
      />

      {urgentTasks ? (
        <div className="flex flex-1 flex-col gap-4">
          <UrgentTaskSection
            title="Diese Woche"
            total={dueThisWeek.total}
            tasks={dueThisWeek.items}
          />

          <UrgentTaskSection
            title="Überfällig"
            total={overdue.total}
            tasks={overdue.items}
          />
        </div>
      ) : (
        <CardEmptyState
          icon={<CalendarClock className="size-5" />}
          title="Keine dringenden Aufgaben"
          description="Wenn Aufgaben heute fällig oder überfällig sind, erscheinen sie hier."
        />
      )}
    </section>
  );
};
export default UrgentTasks;
