import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteProject } from "@/features/projects/api/projects.api";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, string>({
    mutationFn: deleteProject,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
