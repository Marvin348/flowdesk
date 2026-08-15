import {
  List,
  Grid3x3,
  Files,
  UserStar,
  BriefcaseBusiness,
  MessageSquareMore,
} from "lucide-react";

export const TAB_VIEW_OPTIONS = [
  { label: "Übersicht", value: "overview", to: "overview", icon: Grid3x3 },
  { label: "Aufgaben", value: "tasks", to: "tasks", icon: List },
  { label: "Anhänge", value: "files", to: "files", icon: Files },
  {
    label: "Team",
    value: "collaborators",
    to: "collaborators",
    icon: UserStar,
  },
  {
    label: "Kommentare",
    value: "comments",
    to: "comments",
    icon: MessageSquareMore,
  },
  {
    label: "Auslastung",
    value: "workload",
    to: "workload",
    icon: BriefcaseBusiness,
  },
] as const;
