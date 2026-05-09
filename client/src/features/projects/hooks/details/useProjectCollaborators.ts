import { useQuery } from "@tanstack/react-query";
import { fetchProjectCollaborators } from "@/features/projects/api/projectDetails.api";
import type { ProjectCollaboratorDto } from "@shared/types/dto/projects/projectCollaborators.dto";

export const useProjectCollaborators = (id: string) => {
  const { data, isLoading, error } = useQuery<ProjectCollaboratorDto[], Error>({
    queryKey: ["projects", id, "collaborators"],
    queryFn: () => fetchProjectCollaborators(id),
  });

  return { data, isLoading, error };
};
