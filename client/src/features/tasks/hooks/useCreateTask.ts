import { createTask } from "@/features/tasks/api/tasks.api.ts";
import type { CreateTaskInput } from "@shared/types/inputs/createTaskInput";
import type { Task } from "@shared/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput>({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "details"],
      });
    },
  });
};
