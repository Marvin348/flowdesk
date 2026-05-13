import type { User } from "../../user.js";

export type ProjectCollaboratorDto = Pick<
  User,
  "id" | "name" | "email" | "avatarKey" | "role" | "jobTitle"
>;

export type ProjectCollaboratorResponseDto = {
  items: ProjectCollaboratorDto[];
  currentPage: number;
  totalPages: number;
};
