import { ChevronDown } from "lucide-react";
import { STATUS_OPTIONS } from "@/shared/constants/status-options";
import { useState } from "react";
import type { StatusBase } from "@shared/types/StatusBase";
import TaskRow from "@/features/tasks/components/TaskRow";
import { LIST_TABLE_OPTIONS } from "@/shared/constants/table-header";
import { useProjectTasks } from "@/features/projects/hooks/details/useProjectTasks";
import TaskListSkeleton from "@/features/projects/components/projectDetailsPage/skeleton/TaskListSkeleton";

type TaskListViewProps = {
  projectId: string;
};

const TaskListView = ({ projectId }: TaskListViewProps) => {
  const [openStatus, setOpenStatus] = useState<StatusBase | null>("pending");

  const toggleOpenStatus = (value: StatusBase) =>
    setOpenStatus((prev) => (prev === value ? null : value));

  const { data, isLoading, error } = useProjectTasks(projectId);

  const tasks = data?.tasks ?? [];
  const taskStats = data?.taskStats;

  if (isLoading && !data) return <TaskListSkeleton />;
  if (error) return <div>Etwas ist schief gelaufen</div>;

  return (
    <section>
      <div className="grid grid-cols-4 p-2 bg-muted rounded-md">
        {LIST_TABLE_OPTIONS.map((opt) => (
          <button key={opt.value} className="w-fit flex items-center gap-1">
            {opt.label}{" "}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {Object.values(STATUS_OPTIONS).map((opt) => {
          const filteredByStatus = tasks.filter(
            (task) => task.taskStatus === opt.value,
          );
          const statusStats = taskStats?.[opt.value];

          return (
            <div key={opt.value} className=" border-b py-4">
              <button
                className="w-full flex items-center gap-4"
                onClick={() => toggleOpenStatus(opt.value)}
              >
                <span className="border p-0.5 rounded-full hover:bg-muted transform">
                  <ChevronDown
                    className={`transform duration-200 ${openStatus === opt.value ? "rotate-180" : ""} text-muted-foreground`}
                  />
                </span>
                {opt.label}

                <span className="text-muted-foreground font-medium">
                  {filteredByStatus.length}
                </span>

                {openStatus === opt.value && (
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-30 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${statusStats?.percent ?? 0}%` }}
                      />
                    </div>

                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                      {statusStats?.percent ?? 0}% aller Aufgaben
                    </p>
                  </div>
                )}
              </button>

              {openStatus === opt.value && (
                <div className="mt-2 p-4 rounded-md bg-muted">
                  {filteredByStatus.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                  {filteredByStatus.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      Keine Daten vorhanden
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default TaskListView;
