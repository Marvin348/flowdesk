import { fetchProjectSummaries } from "@/api/projects";
import type { ProjectSummariesResponseDto } from "@shared/types/dto/project";
import type { ProjectSummariesInput } from "@shared/types/inputs/projectSummariesInput";
import { useQuery } from "@tanstack/react-query";

export const useProjectSummaries = (input: ProjectSummariesInput) => {
  const { data, isLoading, error } = useQuery<
    ProjectSummariesResponseDto,
    Error
  >({
    queryKey: [
      "projects",
      "summaries",
      input.search,
      input.page,
      input.limit,
      input.filter?.priority,
      input.filter?.status,
      input.filter?.hasAttachments,
    ],
    queryFn: () => fetchProjectSummaries(input),
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
