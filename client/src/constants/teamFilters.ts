import { UserRound, ShieldUser, UserCog, SquareChartGantt } from "lucide-react";
import { PROGRESS_STATUS } from "./progress-status";

export const TEAM_SORT_OPTIONS = [
  { label: "Name A-Z", value: "name_asc" },
  { label: "Name Z-A", value: "name_desc" },
  { label: "Offene Aufgaben", value: "openTasks_desc" },
  { label: "Erledigte Aufgaben zuerst", value: "completedCount_desc" },
] as const;

export const TEAM_ACTIVITY_OPTIONS = [
  { label: "Alle", value: "all" },
  { label: "Aktiv", value: "active" },
  { label: "Frei", value: "free" },
] as const;

export const TEAM_PROGRESS_OPTIONS = Object.values(PROGRESS_STATUS);

export const USER_ROLE_FILTER_OPTIONS = [
  { label: "Alle", value: "all", icon: SquareChartGantt },
  { label: "Member", value: "member", icon: UserRound },
  { label: "Manager", value: "manager", icon: UserCog },
  { label: "Admin", value: "admin", icon: ShieldUser },
] as const;
