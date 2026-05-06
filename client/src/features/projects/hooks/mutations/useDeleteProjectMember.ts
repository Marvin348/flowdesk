import type { DeleteProjectMemberInput } from "@shared/types/inputs/deleteProjectMemberInput";
import type { Project } from "@shared/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectMember } from "@/features/projects/api/projects.api";

export const useDeleteProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, DeleteProjectMemberInput>({
    mutationFn: deleteProjectMember,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
