import { createTask } from "@/api/tasks";
import type { CreateTaskInput } from "@/type/createTaskInput";
import type { Task } from "@/type/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput>({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};
