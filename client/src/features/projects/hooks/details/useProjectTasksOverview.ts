import { fetchProjectTasksOverview } from "@/features/projects/api/projectDetails.api";
import type { ProjectTasksResponseDto } from "@shared/types/dto/projects/projectTasks.dto.js";
import { useQuery } from "@tanstack/react-query";

export const useProjectTasksOverview = (id: string) => {
  const { data, isLoading, error } = useQuery<ProjectTasksResponseDto, Error>({
    queryKey: ["projects", id, "tasks"],
    queryFn: () => fetchProjectTasksOverview(id),
  });

  return { data, isLoading, error };
};
