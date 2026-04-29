import type { User } from "../user.js";
import type { Priority } from "../priority.js";
import type { StatusBase } from "../StatusBase.js";

export type TeamMemberDto = User & {
  stats: {
    completedCount: number;
    openTasks: number;
    progressPercent: number;
    tasksCount: number;
  };
};

export type TeamMembersResponseDto = {
  items: TeamMemberDto[];
  currentPage: number;
  totalPages: number;
};

export type UserDetailsDto = {
  user: UserSummaryDto;

  invitedProjects: {
    id: string;
    title: string;
    priority: Priority;
    projectStatus: StatusBase;
  }[];

  stats: {
    pendingCount: number;
    inProgressCount: number;
    completedCount: number;
  };

  recentCompletedTask: RecentCompletedTaskDto | null;
  nextDueTask: NextDueTaskDto | null;
};

type UserSummaryDto = Pick<
  User,
  "id" | "name" | "email" | "avatarKey" | "jobTitle" | "role"
>;

export type NextDueTaskDto = {
  id: string;
  title: string;
  dueDate: string;
};

export type RecentCompletedTaskDto = {
  id: string;
  title: string;
  completedAt: string;
};
