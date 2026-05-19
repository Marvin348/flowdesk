import { useQuery } from "@tanstack/react-query";
import type { ProjectAttachmentResponseDto } from "@shared/types/dto/projects/projectAttachments.dto";
import type { ProjectAttachmentInput } from "@shared/types/inputs/projectAttachmentInput";
import { fetchProjectAttachments } from "@/features/projects/api/projectDetails.api";

export const useProjectAttachments = (input: ProjectAttachmentInput) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery<ProjectAttachmentResponseDto, Error>({
    queryKey: [
      "projects",
      input.projectId,
      "attachments",
      {
        search: input.search,
        page: input.page,
        limit: input.limit,
      },
    ],
    queryFn: () => fetchProjectAttachments(input),
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
