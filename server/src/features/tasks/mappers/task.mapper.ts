import type { Task } from "@shared/types/task.js";

type TaskDbRecord = Omit<Task, "dueDate" | "reminderAt" | "completedAt"> & {
  _id?: unknown;
  __v?: number;
  dueDate: string | Date;
  reminderAt?: string;
  completedAt?: string | Date;
};

const toIsoString = (value: string | Date | undefined | null): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toTaskDto = (task: TaskDbRecord): Task => {
  return {
    id: task.id,
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

export const toTaskDtos = (tasks: TaskDbRecord[]): Task[] => {
  return tasks.map(toTaskDto);
};
