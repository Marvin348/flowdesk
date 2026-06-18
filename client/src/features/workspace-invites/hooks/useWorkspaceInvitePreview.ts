import { useQuery } from "@tanstack/react-query";
import { getWorkspaceInvitePreview } from "@/features/workspace-invites/api/workspaceInvite.api";
import type { WorkspaceInvitePreviewDto } from "@shared/types/dto/workspace-invites/workspace-invites";

export const useWorkspaceInvitePreview = (token: string) => {
  const { data, isLoading, error } = useQuery<WorkspaceInvitePreviewDto, Error>(
    {
      queryKey: ["workspaceInvitePreview", token],
      queryFn: () => getWorkspaceInvitePreview(token),
    },
  );

  return { data, isLoading, error };
};
