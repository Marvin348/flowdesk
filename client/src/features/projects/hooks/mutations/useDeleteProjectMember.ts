import type { DeleteProjectMemberInput } from "@shared/types/inputs/deleteProjectMemberInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectMember } from "@/features/projects/api/projectMembers.api";

export const useDeleteProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, DeleteProjectMemberInput>({
    mutationFn: deleteProjectMember,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
