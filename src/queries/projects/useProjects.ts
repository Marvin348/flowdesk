import { fetchProjects } from "@/api/projects";
import { useQuery } from "@tanstack/react-query";

export const useProjects = (id?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects", id ?? "all"],
    queryFn: () => fetchProjects(id),
  });

  return { data, isLoading, error };
};
