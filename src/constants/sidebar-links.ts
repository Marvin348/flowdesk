import { House, Users, CirclePile, DiamondPlus } from "lucide-react";

export const SIDEBAR_LINKS = [
  { to: "/", label: "Übersicht", icon: House },
  { to: "/projects", label: "Projekte", icon: CirclePile },
  { to: "/create", label: "Projekte erstellen", icon: DiamondPlus },
  { to: "/team", label: "Team", icon: Users },
] as const;
