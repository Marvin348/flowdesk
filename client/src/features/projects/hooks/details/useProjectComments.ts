import { useQuery } from "@tanstack/react-query";
import type { ProjectCommentsInput } from "@shared/types/inputs/projectCommentsInput";
import type { ProjectCommentsResponseDto } from "@shared/types/dto/projects/projectComments.dto";
import { fetchProjectComments } from "@/features/projects/api/projectDetails.api";

export const useProjectComments = (input: ProjectCommentsInput) => {
  const { data, isLoading, error } = useQuery<
    ProjectCommentsResponseDto,
    Error
  >({
    queryKey: [
      "projects",
      input.projectId,
      "comments",
      {
        limit: input.limit,
        sort: input.sort,
      },
    ],
    queryFn: () => fetchProjectComments(input),
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
