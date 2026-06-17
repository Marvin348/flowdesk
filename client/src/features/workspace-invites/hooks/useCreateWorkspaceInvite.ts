import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createWorkspaceInvite } from "@/features/workspace-invites/api/workspaceInvite.api";

export const useCreateWorkspaceInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspaceInvite,
  });
};
