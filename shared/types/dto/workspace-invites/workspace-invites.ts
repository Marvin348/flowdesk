export type CreatedWorkspaceInviteDto = {
    email: string;
    expiresAt: string;
};

export type WorkspaceInvitePreviewDto = {
  email: string;
  workspaceName: string;
  expiresAt: string;
};
