import type { Task } from "@/type/task";
import { apiClient } from "@/api/client";

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await apiClient.get("/tasks");
  return res.data;
};
