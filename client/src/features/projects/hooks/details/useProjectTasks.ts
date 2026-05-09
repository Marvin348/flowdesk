import { fetchProjectTasks } from "@/features/projects/api/projects.api";
import type { ProjectTaskDto } from "@shared/types/dto/projects/projectTasks.dto";
import { useQuery } from "@tanstack/react-query";

export const useProjectTasks = (id: string) => {
  const { data, isLoading, error } = useQuery<ProjectTaskDto[], Error>({
    queryKey: ["projects", id, "tasks"],
    queryFn: () => fetchProjectTasks(id),
  });

  return { data, isLoading, error };
};
