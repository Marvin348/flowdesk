import { updateProjectMembers } from "@/api/projects";
import type { Project } from "@/type/domain/project";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { UpdateProjectMembersInput } from "@/api/projects";

export const useUpdateProjectMembers = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, UpdateProjectMembersInput>({
    mutationFn: updateProjectMembers,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
};
