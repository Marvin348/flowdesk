export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: "admin" | "member";
};
