import { calcPercent } from "@/shared/utils/calcPercent.js";
import type { Progress } from "@shared/types/dto/common/progress.dto.js";
import type { Task } from "@shared/types/task.js";

export const getProjectProgress = (tasks: Task[]): Progress => {
  const total = tasks.length;

  const completed = tasks.filter((t) => t.taskStatus === "done").length;
  const progressPercent = calcPercent(completed, total);

  return { total, completed, progressPercent };
};
