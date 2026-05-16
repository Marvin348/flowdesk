import type { Project } from "@shared/types/project.js";
import type { User } from "@shared/types/user.js";
import type { ProjectOptionDto } from "@shared/types/dto/projects/projectOptions.dto.js";
import { toUserAvatarDto } from "@/features/users/mappers/user.mapper.js";

export const toProjectOptionDto = (
  project: Project,
  usersById: Map<string, User>,
  userId: string,
): ProjectOptionDto => {
  const users = project.invitedUserIds
    .map((id) => usersById.get(id))
    .filter((user): user is User => Boolean(user))
    .map((user) => toUserAvatarDto(user));

  return {
    id: project.id,
    title: project.title,
    createdAt: project.createdAt,
    isInvited: userId ? project.invitedUserIds.includes(userId) : false,
    users,
  };
};
