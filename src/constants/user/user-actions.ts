import { UserRoundPen, ClipboardList, Trash2 } from "lucide-react";

export const COLLABORATOR_ACTIONS = [
  {
    key: "change_role",
    label: "Rolle ändern",
    icon: UserRoundPen,
  },
  {
    key: "reassign_tasks",
    label: "Aufgabe zuweisen",
    icon: ClipboardList,
  },
  {
    key: "delete",
    label: "Entfernen",
    icon: Trash2,
  },
] as const;

export const BULK_COLLABORATOR_ACTIONS = [
  {
    key: "reassign_tasks",
    label: "Aufgabe zuweisen",
    icon: ClipboardList,
  },
] as const;
