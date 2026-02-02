import { House, Users, CirclePile, DiamondPlus } from "lucide-react";

export const SIDEBAR_LINKS = [
  { to: "/", label: "Übersicht", icon: House },
  { to: "/tasks", label: "Aufgaben", icon: CirclePile },
  { to: "/create", label: "Aufgaben erstellen", icon: DiamondPlus },
  { to: "/team", label: "Team", icon: Users },
];
