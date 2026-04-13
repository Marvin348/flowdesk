import { fetchProjects } from "@/api/projects";
import type { Project } from "@shared/types/project";
import { useQuery } from "@tanstack/react-query";

export const useProjects = () => {
  const { data, isLoading, error } = useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
  });

  return { data, isLoading, error };
};
