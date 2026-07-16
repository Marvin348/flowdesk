import type { User } from "../../user.js";

export type ProjectCollaboratorDto = Pick<
  User,
  "id" | "name" | "email" | "avatarKey" | "avatarUrl" | "role" | "jobTitle"
>;

export type ProjectCollaboratorResponseDto = {
  items: ProjectCollaboratorDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
};
