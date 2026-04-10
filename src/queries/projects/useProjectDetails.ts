import { fetchProjectDetails } from "@/api/projects";
import { useQuery } from "@tanstack/react-query";
import type { ProjectDetails } from "@/type/view-models/projectsWithMeta";

export const useProjectDetails = (id: string) => {
  const { data, isLoading, error } = useQuery<ProjectDetails, Error>({
    queryKey: ["projects", id, "details"],
    queryFn: () => fetchProjectDetails(id),
  });

  return { data, isLoading, error };
};
