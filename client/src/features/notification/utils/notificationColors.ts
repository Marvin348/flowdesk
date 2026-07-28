export const notificationColors = {
  task: {
    icon: "text-[var(--notification-task-fg)]",
    background: "bg-[var(--notification-task-bg)]",
  },
  project: {
    icon: "text-[var(--notification-project-fg)]",
    background: "bg-[var(--notification-project-bg)]",
  },
  comment: {
    icon: "text-[var(--notification-comment-fg)]",
    background: "bg-[var(--notification-comment-bg)]",
  },
  role: {
    icon: "text-[var(--notification-role-fg)]",
    background: "bg-[var(--notification-role-bg)]",
  },
  warning: {
    icon: "text-[var(--notification-warning-fg)]",
    background: "bg-[var(--notification-warning-bg)]",
  },
  danger: {
    icon: "text-[var(--notification-danger-fg)]",
    background: "bg-[var(--notification-danger-bg)]",
  },
  security: {
    icon: "text-[var(--notification-security-fg)]",
    background: "bg-[var(--notification-security-bg)]",
  },
} as const;

export type NotificationColor = keyof typeof notificationColors;
