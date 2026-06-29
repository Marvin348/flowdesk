import type { Task } from "@shared/types/task";
import { apiClient } from "@/shared/api/client";
import type { CreateTaskInput } from "@shared/types/inputs/createTaskInput";
import type { UpdateTaskStatusInput } from "@/features/tasks/types/updateTaskStatusInput";

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
