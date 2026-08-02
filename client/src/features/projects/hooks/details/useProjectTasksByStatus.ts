import { fetchProjectTasksByStatus } from "@/features/projects/api/projectDetails.api";
import type { ProjectTasksByTypeInput } from "@/features/projects/types/projectTasksByTypeInput";
import { PROJECT_TASKS_LIMIT } from "@shared/constants/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useProjectTasksByStatus = ({
  projectId,
  taskStatus,
}: Pick<ProjectTasksByTypeInput, "projectId" | "taskStatus">) => {
  return useInfiniteQuery({
    queryKey: ["projects", projectId, "tasks", "load-more", taskStatus],

    initialPageParam: PROJECT_TASKS_LIMIT,
    enabled: false,

    queryFn: ({ pageParam }) =>
      fetchProjectTasksByStatus({
        projectId,
        taskStatus,
        limit: PROJECT_TASKS_LIMIT,
        offset: pageParam,
      }),

    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < PROJECT_TASKS_LIMIT) {
        return undefined;
      }

      return lastPageParam + lastPage.length;
    },
  });
};
