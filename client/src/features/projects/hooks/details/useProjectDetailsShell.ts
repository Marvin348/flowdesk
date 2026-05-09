import { fetchProjectDetailsShell } from "@/features/projects/api/projectDetails.api.ts";
import { useQuery } from "@tanstack/react-query";
import type { ProjectDetailsShellDto } from "@shared/types/dto/projects/projectDetailsShell.dto";

export const useProjectDetailsShell = (id: string) => {
  const { data, isLoading, error } = useQuery<ProjectDetailsShellDto, Error>({
    queryKey: ["projects", id, "details"],
    queryFn: () => fetchProjectDetailsShell(id),
  });

  return { data, isLoading, error };
};
