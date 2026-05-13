import { fetchProjectsOptions } from "@/features/projects/api/projects.api.ts";
import { useQuery } from "@tanstack/react-query";
import type { ProjectOptionsDto } from "@shared/types/dto/projects/projectOptions.dto";
import type { ProjectOptionsInput } from "@shared/types/inputs/projectOptionsInput";

export const useProjectOptions = (input: ProjectOptionsInput) => {
  const { data, isLoading, error } = useQuery<ProjectOptionsDto, Error>({
    queryKey: ["projects", "options", input.userId, input.search],
    queryFn: () => fetchProjectsOptions(input),
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
