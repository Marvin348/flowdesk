import { useQuery } from "@tanstack/react-query";
import type { ProjectOptionsDto } from "@shared/types/dto/projects/projectOptions.dto";
import type { ProjectOptionsInput } from "@shared/types/inputs/projectOptionsInput";
import { userProjectOptions } from "@/features/users/api/userProjectOptions.api";

export const useUserProjectOptions = (input: ProjectOptionsInput) => {
  const { data, isLoading, error } = useQuery<ProjectOptionsDto, Error>({
    queryKey: ["users", "project-options", input.userId, input.search],
    queryFn: () =>
      userProjectOptions({ search: input.search, userId: input.userId }),
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};
