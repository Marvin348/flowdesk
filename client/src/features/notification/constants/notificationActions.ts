import { Pin, Archive, Trash2 } from "lucide-react";

export const NOTIFICATION_ACTIONS = [
  { action: "pinned", icon: Pin },
  { action: "archived", icon: Archive },
  { action: "delete", icon: Trash2 },
] as const;

export type NotificationActionType =
  (typeof NOTIFICATION_ACTIONS)[number]["action"];
