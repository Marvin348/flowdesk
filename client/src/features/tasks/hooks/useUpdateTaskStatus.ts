import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateTaskStatus } from "@/features/tasks/api/tasks.api";
import type { Task } from "@shared/types/task";
import type { UpdateTaskStatusInput } from "@/features/tasks/types/updateTaskStatusInput";

export const useUpdateTaskStatus = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskStatusInput>({
    mutationFn: updateTaskStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "details"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "tasks"],
      });
    },
  });
};
