import { UserRole } from "@shared/types/user";

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

export const NOTIFICATION_STATUS = ["all", "unread"] as const;

export type NotificationStatus = (typeof NOTIFICATION_STATUS)[number];

export type NotificationDto = {
  id: string;

  type: NotificationType;
  entityType: EntityType;

  actor?: {
    id: string;
    name: string;
  };

  task?: {
    id: string;
    title: string;
    projectId: string;
  };

  project?: {
    id: string;
    title: string;
  };

  metadata?: NotificationMetadata;

  isRead: boolean;
  readAt?: string;
  createdAt: string;
};

export type NotificationMetadata = {
  previousRole: UserRole;
  currentRole: UserRole;
};
