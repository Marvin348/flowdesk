import { updateProjectMembers } from "@/features/projects/api/projectMembers.api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { UpdateProjectMembersInput } from "@shared/types/inputs/updateProjectMembersInput";

export const useUpdateProjectMembers = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, UpdateProjectMembersInput>({
    mutationFn: updateProjectMembers,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "details"],
      });
    },
  });
};
