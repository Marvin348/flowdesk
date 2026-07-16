export type UserWorkloadStats = {
  totalTasks: number;
  user: {
    id: string;
    name: string;
    avatarKey?: string;
    avatarUrl?: string;
    jobTitle?: string;
  };
  byStatusCounts: { pending: number; in_progress: number; done: number };
};

export type UserWorkload = UserWorkloadStats & {
  openCount: number;
  progressPercent: number;
};

export type ProjectWorkloadDto = {
  items: UserWorkload[];
  pagination: {
    totalPages: number;
    currentPage: number;
  };
};
