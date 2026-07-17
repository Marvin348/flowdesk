import { PRIORITY_OPTIONS } from "@/shared/constants/priority-options";
import type { TaskPriorityItemDto } from "@shared/types/dto/dashboard/taskPriorityItem.dto";
import type { Priority } from "@shared/types/Priority";

export type TaskPriorityItem = {
  id: Priority;
  color: string;
  value: Priority;
  label: string;
  count: number;
};

export const mapTaskPriorityItems = (
  taskPrioItems: TaskPriorityItemDto[],
): TaskPriorityItem[] => {
  return Object.values(taskPrioItems).map((item) => {
    const config = PRIORITY_OPTIONS[item.priority];

    return {
      ...config,
      id: item.priority,
      count: item.count,
    };
  });
};
