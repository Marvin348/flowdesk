import { fetchProjectDetails } from "@/features/projects/api/projects.api.ts";
import { useQuery } from "@tanstack/react-query";
import type { ProjectDetailsDto } from "@shared/types/dto/project";

export const useProjectDetails = (id: string) => {
  const { data, isLoading, error } = useQuery<ProjectDetailsDto, Error>({
    queryKey: ["projects", id, "details"],
    queryFn: () => fetchProjectDetails(id),
  });

  return { data, isLoading, error };
};
 