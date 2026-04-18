import type { User } from "../user.js";

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
