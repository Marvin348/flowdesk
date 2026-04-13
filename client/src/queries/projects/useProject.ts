import type { Project } from "@shared/types/project";
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "@/api/projects";

export const useProject = (id: string) => {
  const { data, isLoading, error } = useQuery<Project, Error>({
    queryKey: ["projects", id],
    queryFn: () => fetchProject(id),
  });

  return { data, isLoading, error };
};
