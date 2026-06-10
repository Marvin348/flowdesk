import UpcomingTasksCard from "@/features/dashboard/components/upcomingTasks/UpcomingTasksCard";
import { Link } from "react-router";
import type { UpcomingTaskDto } from "@shared/types/dto/dashboard/upcomingTask.dto";
import CardEmptyState from "@/shared/components/CardEmptyState";
import { CalendarClock } from "lucide-react";

type UpcomingTasksProps = {
  upcomingTasks: UpcomingTaskDto[];
};

const TABLE_HEADER = [
  { label: "Aufgabe", value: "task" },
  { label: "Priorität", value: "priority" },
  { label: "Projekt", value: "project" },
  { label: "Deadline", value: "deadline" },
] as const;

const UpcomingTasks = ({ upcomingTasks }: UpcomingTasksProps) => {
  return (
    <section className="flex flex-col h-full p-4 border rounded-md">
      <div className="flex flex-1 flex-col">
        {upcomingTasks.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-xl">Anstehende Aufgaben</h3>
              <Link to="/projects" className="text-accent text-sm">
                Alle Ansehen
              </Link>
            </div>

            <div className="hidden sm:grid sm:grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 p-2 bg-muted rounded-t-md">
              {TABLE_HEADER.map((t) => (
                <p key={t.value} className="text-muted-foreground">
                  {t.label}
                </p>
              ))}
            </div>

            <div>
              {upcomingTasks.map((item) => (
                <UpcomingTasksCard key={item.taskId} item={item} />
              ))}
            </div>
          </>
        ) : (
          <CardEmptyState
            icon={<CalendarClock className="h-5 w-5" />}
            title="Keine anstehenden Aufgaben"
            description="Aufgaben mit Fälligkeitsdatum erscheinen hier automatisch."
          />
        )}
      </div>
    </section>
  );
};
export default UpcomingTasks;
