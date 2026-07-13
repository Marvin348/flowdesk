import { useMutation } from "@tanstack/react-query";
import { createWorkspaceInvite } from "@/features/workspace-invites/api/workspaceInvite.api";

export const useCreateWorkspaceInvite = () => {

  return useMutation({
    mutationFn: createWorkspaceInvite,
  });
};
