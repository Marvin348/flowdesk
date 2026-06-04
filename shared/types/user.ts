export type UserRole = "admin" | "member" | "manager";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarKey: string;
  role: UserRole;
  jobTitle?: string;
};
