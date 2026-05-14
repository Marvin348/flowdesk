import { User } from "@shared/types/user.js";

export const toUserPreview = (user: User) => ({
  id: user.id,
  name: user.name,
  avatarKey: user.avatarKey,
  jobTitle: user.jobTitle,
});
