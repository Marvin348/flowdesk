import type { AvatarKey } from "@/data/avatar";

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
