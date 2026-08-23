import { CalendarClock, ClipboardList, MessageSquareText } from "lucide-react";

export const QUICK_FILTERS = [
  {
    label: "Kommentare",
    value: "comments",
    icon: MessageSquareText,
  },
  {
    label: "Fälligkeiten",
    value: "deadline",
    icon: CalendarClock,
  },
  {
    label: "Aufgaben",
    value: "tasks",
    icon: ClipboardList,
  },
] as const;
