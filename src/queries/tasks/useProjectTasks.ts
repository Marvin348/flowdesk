import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/api/tasks";
import type { Task } from "@/type/domain/task";

export const useProjectTasks = (projectId: string) => {
  const { data, isLoading, error } = useQuery<Task[], Error>({
    queryKey: ["tasks", projectId],
    queryFn: () => fetchTasks(projectId),
  });

  return { data, isLoading, error };
};
