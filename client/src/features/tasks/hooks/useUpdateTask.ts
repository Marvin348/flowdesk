import type { Task } from "@shared/types/task";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateTask } from "@/features/tasks/api/tasks.api";
import type { UpdateTaskInput } from "@shared/types/inputs/updateTaskInput";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskInput>({
    mutationFn: updateTask,

    onSuccess: (updatedTask) => {
      const projectId = updatedTask.projectId;

      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "details"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", updatedTask.id],
      });
    },
  });
};
