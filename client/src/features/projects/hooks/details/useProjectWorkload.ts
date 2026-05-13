import { fetchProjectWorkload } from "@/features/projects/api/projectDetails.api";
import type { ProjectWorkloadDto } from "@shared/types/dto/workload/projectUserWorkload";
import { useQuery } from "@tanstack/react-query";
import type { ProjectWorkloadInput } from "@shared/types/inputs/projectWorkloadInput";

export const useProjectWorkload = (input: ProjectWorkloadInput) => {
  const { data, isLoading, error } = useQuery<ProjectWorkloadDto, Error>({
    queryKey: [
      "projects",
      input.projectId,
      "workload",
      {
        page: input.page,
        limit: input.limit,
        sort: input.sort,
      },
    ],
    queryFn: () => fetchProjectWorkload(input),
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
