import { House, Users, Folders, CircleUserRound, Settings } from "lucide-react";

export const SIDEBAR_MAIN_LINKS = [
  { to: "/", label: "Übersicht", icon: House },
  { to: "/projects", label: "Projekte", icon: Folders },
  { to: "/team", label: "Team", icon: Users },
] as const;

export const SIDEBAR_FOOTER_LINKS = [
  { to: "/account", label: "Account", icon: CircleUserRound },
  // { to: "/settings", label: "Einstellungen", icon: Settings },
];
