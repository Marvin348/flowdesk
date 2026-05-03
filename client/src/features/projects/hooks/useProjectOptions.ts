import { fetchProjectsOptions } from "@/features/projects/api/projects.api.ts";
import { useQuery } from "@tanstack/react-query";
import type { ProjectOptionsDto } from "@shared/types/dto/project";

export const useProjectOptions = (userId: string, input: string) => {
  const trimmedInput = input.trim();

  const { data, isLoading, error } = useQuery<ProjectOptionsDto, Error>({
    queryKey: ["projects", "options", userId, trimmedInput],
    queryFn: () => fetchProjectsOptions(userId, trimmedInput),
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
