import type { Task } from "@shared/types/task";
import { apiClient } from "@/shared/api/client";
import type { CreateTaskInput } from "@shared/types/inputs/createTaskInput";
import type { UpdateTaskStatusInput } from "@/features/tasks/types/updateTaskStatusInput";
import type { UpdateTaskInput } from "@shared/types/inputs/updateTaskInput";

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await apiClient.get("/tasks");
  return res.data.data;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await apiClient.post("/tasks", input);
  return res.data.data;
};

export const updateTaskStatus = async ({
  taskId,
  taskStatus,
}: UpdateTaskStatusInput): Promise<Task> => {
  const res = await apiClient.patch(`/tasks/${taskId}/status`, { taskStatus });
  return res.data.data;
};

export const getTask = async (taskId: string): Promise<Task> => {
  const res = await apiClient.get(`/tasks/${taskId}`);
  return res.data.task;
};

export const updateTask = async ({
  taskId,
  values,
}: UpdateTaskInput): Promise<Task> => {
  const res = await apiClient.patch(`/tasks/${taskId}`, values);
  return res.data.updatedTask;
};
