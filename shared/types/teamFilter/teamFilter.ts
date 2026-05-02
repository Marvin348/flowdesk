import type { UserRole } from "./../user.js";

export const TEAM_SORT_VALUES = [
  "name_asc",
  "name_desc",
  "openTasks_desc",
  "completedCount_desc",
] as const;

export type TeamSort = (typeof TEAM_SORT_VALUES)[number];

export const TEAM_ACTIVITY_VALUES = ["active", "free"] as const;
export type TeamActivity = (typeof TEAM_ACTIVITY_VALUES)[number];

export const TEAM_PROGRESS_VALUES = ["critical", "warning", "good"] as const;
export type TeamProgress = (typeof TEAM_PROGRESS_VALUES)[number];

export type UserRoleFilter = UserRole | "all";

export type TeamApiFilter = {
  role?: UserRole;
  sort?: TeamSort;
  progress?: TeamProgress;
  activity?: TeamActivity;
};

export type TeamUiFilter = {
  role: UserRole | "all";
  sort?: TeamSort;
  progress?: TeamProgress;
  activity: TeamActivity | "all";
};
