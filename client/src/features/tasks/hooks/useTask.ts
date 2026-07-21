import { getTask } from "../api/tasks.api";
import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/types/task";

export const useTask = (taskId: string | null) => {
  const { data, isLoading, error } = useQuery<Task, Error>({
    queryKey: ["tasks", taskId],
    queryFn: () => {
      if (!taskId) {
        throw new Error("Task-ID fehlt");
      }

      return getTask(taskId);
    },
    enabled: taskId !== null,
  });

  return { data, isLoading, error };
};
