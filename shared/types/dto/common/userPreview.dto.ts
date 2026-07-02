import type { User } from "../../user.js";

export type UserPreviewDto = {
  id: string;
  name: string;
  avatarKey?: string;
  avatarUrl?: string;
  jobTitle?: User["jobTitle"];
};

export type UserAvatarDto = {
  id: string;
  avatarKey?: string;
  avatarUrl?: string;
};
