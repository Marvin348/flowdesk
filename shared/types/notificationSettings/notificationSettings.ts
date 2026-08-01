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
