export type ActivityDto = {
  id: string;
  type: ActivityType;
  entityType: EntityType;
  entityId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    avatarKey: string;
  };
};

export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type EntityType = (typeof ENTITY_TYPES)[number];

export const ENTITY_TYPES = [
  "workspace_invite",
  "project",
  "task",
  "comment",
  "attachment",
] as const;

export const ACTIVITY_TYPES = [
  // Workspace invites
  "workspace_invite.created",
  "workspace_invite.accepted",

  // Projects
  "project.created",
  "project.deleted",

  // Tasks
  "task.created",
  "task.status_changed",
  "task.deleted",

  // Comments
  "comment.created",
  "comment.deleted",

  // Attachments
  "attachment.uploaded",
  "attachment.deleted",
] as const;
