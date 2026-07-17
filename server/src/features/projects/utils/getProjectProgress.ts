import { calcPercent } from "@/shared/utils/calcPercent";
import type { Progress } from "@shared/types/dto/common/progress.dto";
import type { Task } from "@shared/types/task";

export const getProjectProgress = (tasks: Task[]): Progress => {
  const total = tasks.length;

  const completed = tasks.filter((t) => t.taskStatus === "done").length;
  const progressPercent = calcPercent(completed, total);

  return { total, completed, progressPercent };
};
