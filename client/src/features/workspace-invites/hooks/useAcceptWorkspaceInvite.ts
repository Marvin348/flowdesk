import { useQueryClient, useMutation } from "@tanstack/react-query";
import { acceptWorkspaceInvite } from "@/features/workspace-invites/api/workspaceInvite.api";

export const useAcceptWorkspaceInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptWorkspaceInvite,

    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
};
