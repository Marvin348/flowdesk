import type { Project } from "@/type/domain/project";
import type { CreateProjectInput } from "@/type/inputs/createProjectInput";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createProject } from "@/api/projects";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectInput>({
    mutationFn: createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
