import type { Project } from "@/type/domain/project";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteProject } from "@/api/projects";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, string>({
    mutationFn: deleteProject,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
