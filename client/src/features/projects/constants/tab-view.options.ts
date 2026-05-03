import {
  List,
  Grid3x3,
  Files,
  UserStar,
  BriefcaseBusiness,
  MessageSquareMore,
} from "lucide-react";

export const TAB_VIEW_OPTIONS = [
  { label: "Übersicht", value: "overview", icon: Grid3x3 },
  { label: "Liste", value: "list", icon: List },
  { label: "Anhänge", value: "files", icon: Files },
  { label: "Team", value: "collaborators", icon: UserStar },
  { label: "Kommentare", value: "comments", icon: MessageSquareMore },
  { label: "Auslastung", value: "workload", icon: BriefcaseBusiness },
] as const;
