import { House, Users, Folders, Activity } from "lucide-react";

export const SIDEBAR_MAIN_LINKS = [
  { to: "/dashboard", label: "Übersicht", icon: House },
  { to: "/projects", label: "Projekte", icon: Folders },
  { to: "/team", label: "Team", icon: Users },
  { to: "/activity", label: "Aktivität", icon: Activity },
] as const;
