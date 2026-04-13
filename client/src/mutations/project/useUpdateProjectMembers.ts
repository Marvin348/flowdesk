import { updateProjectMembers } from "@/api/projects";
import type { Project } from "@shared/types/project";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { UpdateProjectMembersInput } from "@shared/types/inputs/updateProjectMembersInput";

export const useUpdateProjectMembers = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, UpdateProjectMembersInput>({
    mutationFn: updateProjectMembers,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "details"],
      });
    },
  });
};
