export type UserWorkloadStats = {
  totalTasks: number;
  user: {
    id: string;
    name: string;
    avatarKey: string;
  };
  byStatusCounts: { pending: number; in_progress: number; done: number };
};

export type UserWorkload = UserWorkloadStats & {
  openCount: number;
  progressPercent: number;
};
