import { Bell, MessageSquareText, Timer } from "lucide-react";
import type { NotificationSettingKey } from "@shared/types/notificationSettings/notificationSettings";
import type { LucideIcon } from "lucide-react";

type NotificationSettingUiItem = {
  label: string;
  value: NotificationSettingKey;
  description: string;
  icon: LucideIcon;
};

export const NOTIFICATION_SETTINGS_UI: NotificationSettingUiItem[] = [
  {
    label: "Zuweisungen",
    value: "assignments",
    description: "Benachrichtige mich, wenn mir Aufgaben zugewiesen werden.",
    icon: Bell,
  },
  {
    label: "Kommentare",
    value: "comments",
    description: "Benachrichtige mich bei neuen Kommentaren und Antworten.",
    icon: MessageSquareText,
  },
  {
    label: "Deadlines",
    value: "deadlines",
    description: "Benachrichtige mich bei nahenden und verpassten Fristen.",
    icon: Timer,
  },
];
