import { fetchProjectSummaries } from "@/api/projects";
import type { ProjectSummaryDto } from "@shared/types/dto/project";
import { useQuery } from "@tanstack/react-query";

export const useProjectSummaries = () => {
  const { data, isLoading, error } = useQuery<ProjectSummaryDto[], Error>({
    queryKey: ["projects", "summaries"],
    queryFn: () => fetchProjectSummaries(),
  });

  return { data, isLoading, error };
};
