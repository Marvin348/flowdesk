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
    email: string;
  };
};

export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type EntityType = (typeof ENTITY_TYPES)[number];

export const ACTIVITY_TYPES = [
  "workspace_invite.created",
  "workspace_invite.accepted",
  "project.created",
  "task.created",
  "task.status_changed",
  "comment.created",
  "attachment.uploaded",
] as const;

export const ENTITY_TYPES = [
  "workspace_invite",
  "project",
  "task",
  "comment",
  "attachment",
] as const;
