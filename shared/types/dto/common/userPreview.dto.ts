import type { User } from "../../user.js";

export type UserPreviewDto = {
  id: string;
  name: string;
  avatarKey?: string;
  jobTitle?: User["jobTitle"];
};
