import { fetchProjects } from "@/api/projects";
import type { Project } from "@/type/domain/project";
import { useQuery } from "@tanstack/react-query";

export const useProject = (id: string) => {
  const { data, isLoading, error } = useQuery<Project[], Error>({
    queryKey: ["projects", id],
    queryFn: () => fetchProjects(id),
  });

  return { data, isLoading, error };
};
