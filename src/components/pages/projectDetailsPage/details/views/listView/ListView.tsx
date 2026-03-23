import { ChevronDown } from "lucide-react";
import { STATUS_OPTIONS } from "@/constants/status-options";
import { useState } from "react";
import type { StatusBase } from "@/type/domain/StatusBase";
import TaskRow from "@/components/pages/projectDetailsPage/details/views/listView/TaskRow";
import type { TaskWithMeta } from "@/type/view-models/taskWithMeta";

const ListView = ({ tasks }: { tasks: TaskWithMeta[] }) => {
  const [openStatus, setOpenStatus] = useState<StatusBase | null>(null);

  console.log(openStatus);

  const toggleOpenStatus = (value: StatusBase) =>
    setOpenStatus((prev) => (prev === value ? null : value));

  const tableHeader = [
    { label: "Name", value: "name" },
    { label: "Mitarbeiter", value: "assignee" },
    { label: "Deadline", value: "dueDate" },
    { label: "Priorität", value: "priority" },
  ];

  return (
    <>
      <div className="grid grid-cols-4 p-2 bg-muted-foreground/10 rounded-md">
        {tableHeader.map((header) => (
          <p key={header.value}>{header.label}</p>
        ))}
      </div>

      <div className="mt-6">
        {Object.values(STATUS_OPTIONS).map((opt) => {
          const filteredByStatus = tasks.filter(
            (task) => task.taskStatus === opt.value,
          );

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
                  {filteredByStatus.length}
                </span>
              </button>

              {openStatus === opt.value && (
                <div className="mt-2 p-4 rounded-md bg-muted-foreground/10">
                  {filteredByStatus.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                  {filteredByStatus.length === 0 && <div>Noch keine Daten</div>}
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
