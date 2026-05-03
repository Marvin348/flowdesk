import type { UpcomingTask } from "@/features/dashboard/utils/getUpcomingTasks";
import { PRIORITY_OPTIONS } from "@/shared/constants/priority-options";
import { formatDate } from "@/shared/utils/formatDate";

const UpcomingTasksCard = ({ item }: { item: UpcomingTask }) => {
  const { taskTitle, projectTitle, priority, dueDate } = item;

  const priorityLabel = PRIORITY_OPTIONS[priority].label;
  const priorityColor = PRIORITY_OPTIONS[priority].color;

  return (
    <div className="grid sm:grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 p-2 border-b last:border-none">
      <p className="truncate">{taskTitle}</p>
      <p
        style={{ backgroundColor: priorityColor }}
        className="flex items-center justify-center w-fit px-3 max-h-[1.5rem] rounded-full"
      >
        {priorityLabel}
      </p>
      <p className="truncate">{projectTitle}</p>
      <p className="truncate">{formatDate(dueDate)}</p>
    </div>
  );
};
export default UpcomingTasksCard;
