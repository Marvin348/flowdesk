import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { STATUS_OPTIONS } from "@/constants/status-options";
import { useState } from "react";
import type { StatusBase } from "@/type/domain/StatusBase";
import TaskRow from "@/components/pages/projectDetailsPage/details/views/listView/TaskRow";
import type { TaskWithMeta } from "@/type/view-models/taskWithMeta";
import { getSortedList } from "@/utils/list/getSortedList";

type SortKey = "task" | "assignee" | "dueDate" | "priority";

export type SortedByList = {
  sortKey?: SortKey;
  sortDirection?: "asc" | "desc";
};

const ListView = ({ tasks }: { tasks: TaskWithMeta[] }) => {
  const [sortedBy, setSortedBy] = useState<SortedByList | null>(null);
  const [openStatus, setOpenStatus] = useState<StatusBase | null>(null);

  const toggleSortedBy = (value: SortKey) =>
    setSortedBy((prev) => {
      if (prev?.sortKey !== value) {
        return {
          sortKey: value,
          sortDirection: "asc",
        };
      }

      return {
        sortKey: value,
        sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
      };
    });

  const toggleOpenStatus = (value: StatusBase) =>
    setOpenStatus((prev) => (prev === value ? null : value));

  const TABLE_OPTIONS = [
    { label: "Aufgabe", value: "task" },
    { label: "Mitarbeiter", value: "assignee" },
    { label: "Deadline", value: "dueDate" },
    { label: "Priorität", value: "priority" },
  ] as const;

  return (
    <>
      <div className="grid grid-cols-4 p-2 bg-muted-foreground/10 rounded-md">
        {TABLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className="w-fit flex items-center gap-1"
            onClick={() => toggleSortedBy(opt.value)}
          >
            {opt.label} <ChevronsUpDown className="size-4 text-surface/80" />
          </button>
        ))}
      </div>

      <div className="mt-6">
        {Object.values(STATUS_OPTIONS).map((opt) => {
          const filteredByStatus = tasks.filter(
            (task) => task.taskStatus === opt.value,
          );
          const sortedList = getSortedList(filteredByStatus, sortedBy);

          return (
            <div key={opt.value} className=" border-b py-4">
              <button
                className="w-full flex items-center gap-4"
                onClick={() => toggleOpenStatus(opt.value)}
              >
                <span className="border p-0.5 rounded-full hover:bg-muted-foreground/5 transform">
                  <ChevronDown
                    className={`transform duration-200 ${openStatus === opt.value ? "rotate-180" : ""} text-surface/80`}
                  />
                </span>
                {opt.label}

                <span className="text-muted-foreground font-medium">
                  {sortedList.length}
                </span>
              </button>

              {openStatus === opt.value && (
                <div className="mt-2 p-4 rounded-md bg-muted-foreground/10">
                  {sortedList.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                  {sortedList.length === 0 && <div>Noch keine Daten</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
export default ListView;
