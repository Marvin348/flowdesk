import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/api/tasks";

export const useTasks = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  return { data, isLoading, error };
};
