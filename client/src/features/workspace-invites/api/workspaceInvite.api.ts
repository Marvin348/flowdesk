import { apiClient } from "@/shared/api/client";
import type { InviteMemberFields } from "@/features/workspace-invites/schemas/inviteMemberSchema";
import type { CreatedWorkspaceInviteDto } from "@shared/types/dto/workspace-invites/workspace-invites";

export const createWorkspaceInvite = async (
  input: InviteMemberFields,
): Promise<CreatedWorkspaceInviteDto> => {
  const res = await apiClient.post("/workspace-invites", input);
  console.log(res.data.invite);
  return res.data.invite;
};
