import type { Project } from "@shared/types/project";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createProject } from "@/features/projects/api/projects.api";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectInput>({
    mutationFn: createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
