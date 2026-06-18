import { apiClient } from "@/shared/api/client";
import type { InviteMemberFields } from "@/features/workspace-invites/schemas/inviteMemberSchema";
import type { CreatedWorkspaceInviteDto } from "@shared/types/dto/workspace-invites/workspace-invites";
import type { WorkspaceInvitePreviewDto } from "@shared/types/dto/workspace-invites/workspace-invites";
import type { AcceptInviteFields } from "@/features/workspace-invites/schemas/acceptInviteSchema";
import type { User } from "@shared/types/user";

type AcceptWorkspaceInviteVariables = {
  token: string;
  input: AcceptInviteFields;
};

export const createWorkspaceInvite = async (
  input: InviteMemberFields,
): Promise<CreatedWorkspaceInviteDto> => {
  const res = await apiClient.post("/workspace-invites", input);
  return res.data.invite;
};

export const getWorkspaceInvitePreview = async (
  token: string,
): Promise<WorkspaceInvitePreviewDto> => {
  const res = await apiClient.get(`/workspace-invites/${token}`);
  return res.data.invite;
};

export const acceptWorkspaceInvite = async ({
  token,
  input,
}: AcceptWorkspaceInviteVariables): Promise<User> => {
  const res = await apiClient.post(`/workspace-invites/${token}/accept`, input);
  return res.data.user;
};
