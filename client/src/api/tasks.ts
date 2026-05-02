import type { Task } from "@shared/types/task";
import { apiClient } from "@/api/client";
import type { CreateTaskInput } from "@shared/types/inputs/createTaskInput";

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await apiClient.get("/tasks");
  return res.data.data;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await apiClient.post("/tasks", input);

  return res.data.data;
};
