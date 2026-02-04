import type { AvatarKey } from "@/data/avatar";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarKey?: AvatarKey;
  role?: "admin" | "member";
};
