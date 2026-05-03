import type { Project } from "@shared/types/project";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteProject } from "@/features/projects/api/projects.api";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, string>({
    mutationFn: deleteProject,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
