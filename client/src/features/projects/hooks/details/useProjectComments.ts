import { useQuery } from "@tanstack/react-query";
import type { ProjectCommentsResponseDto } from "@shared/types/dto/projects/projectComments.dto";
import { fetchProjectComments } from "@/features/projects/api/projects.api";

export const useProjectComments = (id: string) => {
  const { data, isLoading, error } = useQuery<ProjectCommentsResponseDto, Error>({
    queryKey: ["projects", id, "comments"],
    queryFn: () => fetchProjectComments(id),
  });

  return { data, isLoading, error };
};
