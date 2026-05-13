import { Task } from "@shared/types/task.js";
import { calcPercent } from "@/utils/calcPercent.js";
import type { Progress } from "@shared/types/dto/common/progress.js";

export const getProjectProgress = (tasks: Task[]): Progress => {
  const total = tasks.length;

  const completed = tasks.filter((t) => t.taskStatus === "done").length;
  const progressPercent = calcPercent(completed, total);

  return { total, completed, progressPercent };
};
