// project
type StatusBase = "pending" | "in_progress" | "done";
type Priority = "low" | "medium" | "high";

export type Project = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  projectStatus: StatusBase;
  dueDate: string;
  invitedUserIds: string[];
  createdAt: string;
  updatedAt?: string;
};

// task
export type Task = {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  taskStatus: StatusBase;
  collaboratorIds: string[];
  taskPriority: Priority;
  description?: string;
  tags?: string;
  reminderAt?: string;
};

// comment
export type Comment = {
  id: string;
  taskId: string;
  userId: string;
  message: string;
  createdAt: string;
  parentCommentId?: string;
};

// attachment
export type Attachment = {
  id: string;
  taskId: string;
  fileName: string;
  url: string;
};

export type Database = {
  users: User[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  attachments: Attachment[];
};

// user
// refactor later
const avatarKeys = [
  "m1",
  "m2",
  "m3",
  "m4",
  "m5",
  "m6",
  "m7",
  "m8",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
  "f10",
  "f11",
] as const;

export type AvatarKey = (typeof avatarKeys)[number];

export type UserRole = "admin" | "member" | "manager";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarKey?: AvatarKey;
  role: UserRole;
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
