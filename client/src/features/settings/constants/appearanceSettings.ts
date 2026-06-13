import { Moon, Sun, SunMoon } from "lucide-react";

export const THEME_SETTINGS = [
  { value: "system", label: "System", icon: SunMoon },
  { value: "light", label: "Hell", icon: Sun },
  { value: "dark", label: "Dunkel", icon: Moon },
] as const;

export const DENSITY_SETTINGS = [
  { value: "default", label: "Standard" },
  { value: "compact", label: "Kompakt" },
] as const;

export const START_VIEW_SETTINGS = [
  { value: "dashboard", label: "Dashboard" },
  { value: "projects", label: "Projekte" },
  { value: "team", label: "Team" },
] as const;
