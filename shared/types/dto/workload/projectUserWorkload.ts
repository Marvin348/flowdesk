export type UserWorkloadStats = {
  totalTasks: number;
  user: {
    id: string;
    name: string;
    avatarKey: string;
    jobTitle?:
      | "Frontend Developer"
      | "Designer"
      | "Project Manager"
      | "Backend Developer"
      | "Art Director"
      | "Fullstack Developer"
      | "DevOps Engineer"
      | "QA Engineer"
      | "Motion Designer";
  };
  byStatusCounts: { pending: number; in_progress: number; done: number };
};

export type UserWorkload = UserWorkloadStats & {
  openCount: number;
  progressPercent: number;
};

export type ProjectWorkloadDto = {
  items: UserWorkload[];
  totalPages: number;
  currentPage: number;
};
