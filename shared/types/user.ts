export type UserRole = "admin" | "member" | "manager";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarKey: AvatarKey;
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

export type AvatarKey = (typeof avatarKeys)[number];

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
