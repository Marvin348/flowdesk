import type {
  NotificationFilterType,
  NotificationSettingKey,
} from "@shared/types/notificationSettings/notificationSettings";
import type { NotificationType } from "@shared/types/dto/notification/notification.dto";

export const notificationSettingByType: Record<
  NotificationType,
  NotificationSettingKey | null
> = {
  task_assigned: "assignments",
  project_assigned: "assignments",

  comment_reply: "comments",
  comment_mention: "comments",

  task_due_soon: "deadlines",
  task_overdue: "deadlines",
  project_due_soon: "deadlines",

  password_changed: null,
  email_changed: null,
  role_changed: null,
};

export const NOTIFICATION_FILTER_MAP = {
  tasks: ["task_assigned", "task_due_soon", "task_overdue"],

  comments: ["comment_mention", "comment_reply"],

  deadline: ["task_due_soon", "task_overdue", "project_due_soon"],
} satisfies Record<NotificationFilterType, NotificationType[]>;
