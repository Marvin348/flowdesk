export type NotificationSettings = {
  assignments: boolean;
  comments: boolean;
  deadlines: boolean;
};

export const NOTIFICATION_SETTINGS_KEY = [
  "assignments",
  "comments",
  "deadlines",
] as const;

export type NotificationSettingKey = (typeof NOTIFICATION_SETTINGS_KEY)[number];

export const NOTIFICATION_VIEW = ["inbox", "archive"] as const;

export type NotificationView = (typeof NOTIFICATION_VIEW)[number];

export const NOTIFICATION_FILTER_TYPE = [
  "comments",
  "deadline",
  "tasks",
] as const;

export type NotificationFilterType = (typeof NOTIFICATION_FILTER_TYPE)[number];
