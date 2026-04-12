import type { UpcomingTask } from "@/utils/dashboard/tasks/getUpcomingTasks";
import UpcomingTasksCard from "@/components/pages/dashboardPage/upcomingTasks/UpcomingTasksCard";
import { Link } from "react-router";

type UpcomingTasksProps = {
  upcomingTasks: UpcomingTask[];
};

const TABLE_HEADER = [
  { label: "Aufgabe", value: "task" },
  { label: "Priorität", value: "priority" },
  { label: "Projekt", value: "project" },
  { label: "Deadline", value: "deadline" },
] as const;

const UpcomingTasks = ({ upcomingTasks }: UpcomingTasksProps) => {
  return (
    <section className="h-full">
      <div className="p-4 border rounded-md h-full">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-xl">Anstehende Aufgaben</h3>
          <Link to="/projects" className="text-accent text-sm">
            Alle Ansehen
          </Link>
        </div>

        <div className="mt-4 hidden sm:grid sm:grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 p-2 bg-muted-foreground/10 rounded-t-md">
          {TABLE_HEADER.map((t) => (
            <p key={t.value} className="text-muted-foreground">{t.label}</p>
          ))}
        </div>

        <div>
          {upcomingTasks.map((item) => (
            <UpcomingTasksCard key={item.taskId} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default UpcomingTasks;
