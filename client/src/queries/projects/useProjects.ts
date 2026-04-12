import { fetchProjects } from "@/api/projects";
import type { Project } from "@/type/domain/project";
import { useQuery } from "@tanstack/react-query";

export const useProjects = () => {
  const { data, isLoading, error } = useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
  });

  return { data, isLoading, error };
};
