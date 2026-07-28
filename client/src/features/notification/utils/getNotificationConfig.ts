import {
  AtSign,
  FolderKanban,
  MessageSquareText,
  ShieldCheck,
  TimerOff,
  ClipboardList,
  CalendarClock,
  LockKeyhole,
  Mail,
} from "lucide-react";
import type { NotificationType } from "@shared/types/dto/notification/notification.dto";
import type { LucideIcon } from "lucide-react";
import type { NotificationColor } from "./notificationColors";

export const notificationConfig = {
  task_assigned: {
    icon: ClipboardList,
    label: "Aufgabe zugewiesen",
    entityLabel: "Aufgabe",
    color: "task",
  },

  task_due_soon: {
    icon: CalendarClock,
    label: "Aufgabe bald fällig",
    entityLabel: "Aufgabe",
    color: "warning",
  },

  task_overdue: {
    icon: TimerOff,
    label: "Aufgabe überfällig",
    entityLabel: "Aufgabe",
    color: "danger",
  },

  project_assigned: {
    icon: FolderKanban,
    label: "Projektzuweisung",
    entityLabel: "Projekt",
    color: "project",
  },

  project_due_soon: {
    icon: CalendarClock,
    label: "Projekt bald fällig",
    entityLabel: "Projekt",
     color: "warning",
  },

  comment_mention: {
    icon: AtSign,
    label: "Erwähnung",
    entityLabel: "Kommentar",
    color: "comment",
  },

  comment_reply: {
    icon: MessageSquareText,
    label: "Antwort",
    entityLabel: "Kommentar",
    color: "comment",
  },

  role_changed: {
    icon: ShieldCheck,
    label: "Rolle geändert",
    entityLabel: "Rolle",
    color: "role",
  },

  password_changed: {
    icon: LockKeyhole,
    label: "Passwort geändert",
    entityLabel: "Passwort",
    color: "security",
  },

  email_changed: {
    icon: Mail,
    label: "Email geändert",
    entityLabel: "Email",
    color: "security",
  }
} satisfies Record<
  NotificationType,
  {
    icon: LucideIcon;
    label: string;
    entityLabel: string;
    color: NotificationColor;
  }
>;
