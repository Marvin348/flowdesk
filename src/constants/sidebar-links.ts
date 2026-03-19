import { House, Users, Folders } from "lucide-react";

export const SIDEBAR_LINKS = [
  { to: "/", label: "Übersicht", icon: House },
  { to: "/projects", label: "Projekte", icon: Folders },
  { to: "/team", label: "Team", icon: Users },
] as const;
