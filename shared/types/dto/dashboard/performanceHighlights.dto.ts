import type { User } from "@shared/types/user.js";

export type PerformanceType =
  | "overloaded"
  | "mostOpenTasks"
  | "mostCompleted"
  | "bestProgress";

export type PerformanceHighlightDto = {
  type: PerformanceType;
  user: {
    id: string;
    name: string;
    avatarKey?: string;
    avatarUrl?: string;
    jobTitle?: User["jobTitle"];
  };
  stats: {
    completedCount: number;
    openTasks: number;
    progressPercent: number;
    tasksCount: number;
  };
};
