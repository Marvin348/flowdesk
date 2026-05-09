import { useQuery } from "@tanstack/react-query";
import { fetchProjectOverview } from "@/features/projects/api/projectDetails.api";
import type { ProjectOverviewDto } from "@shared/types/dto/projects/projectOverview.dto";

export const useProjectOverview = (id: string) => {
  const { data, isLoading, error } = useQuery<ProjectOverviewDto, Error>({
    queryKey: ["projects", id, "overview"],
    queryFn: () => fetchProjectOverview(id),
  });

  return { data, isLoading, error };
};
