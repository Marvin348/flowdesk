import { useQuery } from "@tanstack/react-query";
import { fetchProjectCollaborators } from "@/features/projects/api/projectDetails.api";
import type { ProjectCollaboratorResponseDto } from "@shared/types/dto/projects/projectCollaborators.dto";
import type { ProjectCollaboratorsInput } from "@shared/types/inputs/projectCollaboratorsInput";

export const useProjectCollaborators = (input: ProjectCollaboratorsInput) => {
  const { data, isLoading, error } = useQuery<
    ProjectCollaboratorResponseDto,
    Error
  >({
    queryKey: [
      "projects",
      input.projectId,
      "collaborators",
      {
        sort: input?.sort,
        page: input.page,
        limit: input.limit,
      },
    ],
    queryFn: () => fetchProjectCollaborators(input),
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
