import type { Project } from "@shared/types/project";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { assignUserToProjects } from "@/features/projects/api/projects.api";
import type { AssignUserToProjectsInput } from "@shared/types/inputs/assignUserToProjectsInput";

export const useAssignUserToProjects = () => {
  const queryClient = useQueryClient();

  return useMutation<Project[], Error, AssignUserToProjectsInput>({
    mutationFn: assignUserToProjects,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
