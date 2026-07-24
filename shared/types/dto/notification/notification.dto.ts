export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_TYPES = [
  "task_assigned",
  "task_due_soon",
  "task_overdue",
  "project_assigned",
  "project_due_soon",
  "comment_mention",
  "comment_reply",
  "role_changed",
] as const;

export const NOTIFICATION_ENTITY_TYPES = [
  "task",
  "project",
  "comment",
  "user",
] as const;

export type EntityType = (typeof NOTIFICATION_ENTITY_TYPES)[number];
