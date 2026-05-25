import type { Task } from "@shared/types/task.js";
import type { TaskDocument } from "@/features/tasks/types/task.document.js";

const toIsoString = (value: string | Date | undefined | null): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toTaskDto = (task: TaskDocument): Task => {
  return {
    id: task._id.toString(),
    projectId: task.projectId,
    title: task.title,
    dueDate: toIsoString(task.dueDate),
    taskStatus: task.taskStatus,
    collaboratorIds: task.collaboratorIds,
    taskPriority: task.taskPriority,
    description: task.description,
    tags: task.tags,
    reminderAt: task.reminderAt,
    completedAt: task.completedAt ? toIsoString(task.completedAt) : undefined,
  };
};

export const toTaskDtos = (tasks: TaskDocument[]): Task[] => {
  return tasks.map(toTaskDto);
};
