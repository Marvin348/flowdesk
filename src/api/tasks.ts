import type { Task } from "@/type/task";
import { apiClient } from "@/api/client";

export const fetchTasks = async (projectId?: string): Promise<Task[]> => {
  const url = projectId ? `/tasks?projectId=${projectId}` : "/tasks";
  const res = await apiClient.get(url);
  return res.data;
};

// export const createTask = async (payload) => {
//   const res = await apiClient.post(`/tasks`);
// };
