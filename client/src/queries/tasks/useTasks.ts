import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/api/tasks";
import type { Task } from "@shared/types/task";

export const useTasks = () => {
  const { data, isLoading, error } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(),
  });

  return { data, isLoading, error };
};
