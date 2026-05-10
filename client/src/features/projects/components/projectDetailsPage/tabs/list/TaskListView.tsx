import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { STATUS_OPTIONS } from "@/shared/constants/status-options";
import { useState } from "react";
import type { StatusBase } from "@shared/types/StatusBase";
import TaskRow from "@/features/tasks/components/TaskRow";
import { getSortedList } from "@/features/tasks/utils/getSortedList";
import { LIST_TABLE_OPTIONS } from "@/shared/constants/table-header";
// import { updateSort } from "@/shared/utils/updateSort";
import { useProjectTasks } from "@/features/projects/hooks/details/useProjectTasks";

type SortKey = "task" | "assignee" | "dueDate" | "priority";

export type SortedByList = {
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
};

type TaskListViewProps = {
  projectId: string;
};

const TaskListView = ({ projectId }: TaskListViewProps) => {
  const [sortedBy, setSortedBy] = useState<SortedByList | null>(null);
  const [openStatus, setOpenStatus] = useState<StatusBase | null>(null);

  // const toggleSortedBy = (value: SortKey) => updateSort(value, setSortedBy);

  const toggleOpenStatus = (value: StatusBase) =>
    setOpenStatus((prev) => (prev === value ? null : value));

  const { data: tasks, isLoading, error } = useProjectTasks(projectId);

  if (isLoading) return <div>loading</div>;
  if (error) return <div>Etwas ist schief gelaufen</div>;
  if (!tasks) return <div>Project not found</div>;

  console.log("LIST", tasks);

  return (
    <section>
      <div className="grid grid-cols-4 p-2 bg-muted rounded-md">
        {LIST_TABLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className="w-fit flex items-center gap-1"
            // onClick={() => toggleSortedBy(opt.value)}
          >
            {opt.label} <ChevronsUpDown className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <div className="mt-6">
        {Object.values(STATUS_OPTIONS).map((opt) => {
          const filteredByStatus = tasks.filter(
            (task) => task.taskStatus === opt.value,
          );
          // const sortedList = getSortedList(filteredByStatus, sortedBy);

          return (
            <div key={opt.value} className=" border-b py-4">
              <button
                className="w-full flex items-center gap-4"
                onClick={() => toggleOpenStatus(opt.value)}
              >
                <span className="border p-0.5 rounded-full hover:bg-muted-foreground/5 transform">
                  <ChevronDown
                    className={`transform duration-200 ${openStatus === opt.value ? "rotate-180" : ""} text-muted-foreground`}
                  />
                </span>
                {opt.label}

                <span className="text-muted-foreground font-medium">
                  {filteredByStatus.length}
                </span>
              </button>

              {openStatus === opt.value && (
                <div className="mt-2 p-4 rounded-md bg-muted-foreground/10">
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
