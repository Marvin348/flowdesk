import { fetchProjectTasks } from "@/features/projects/api/projectDetails.api";
import type { ProjectTasksResponseDto } from "@shared/types/dto/projects/projectTasks.dto.js";
import { useQuery } from "@tanstack/react-query";

export const useProjectTasks = (id: string) => {
  const { data, isLoading, error } = useQuery<ProjectTasksResponseDto, Error>({
    queryKey: ["projects", id, "tasks"],
    queryFn: () => fetchProjectTasks(id),
  });

  return { data, isLoading, error };
};
