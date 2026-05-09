import type { User } from "../../user.js";

export type ProjectCollaboratorDto = Pick<
  User,
  "id" | "name" | "email" | "avatarKey" | "role" | "jobTitle"
>;
