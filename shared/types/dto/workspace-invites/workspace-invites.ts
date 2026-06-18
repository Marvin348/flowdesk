export type CreatedWorkspaceInviteDto = {
  email: string;
  inviteUrl: string;
  expiresAt: string;
};

export type WorkspaceInvitePreviewDto = {
  email: string;
  workspaceName: string;
  expiresAt: string;
};
