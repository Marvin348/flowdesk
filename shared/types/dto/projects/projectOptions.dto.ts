import { UserAvatarDto } from "@shared/types/dto/common/userPreview.dto.js";

export type ProjectOptionDto = {
  id: string;
  title: string;
  isInvited: boolean;
  createdAt: string;
  users: UserAvatarDto[];
};

export type ProjectOptionsDto = {
  recent: ProjectOptionDto[];
  results: ProjectOptionDto[];
};
