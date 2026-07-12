import type { ProjectOptionDto } from "@shared/types/dto/projects/projectOptions.dto.js";
import { isDefined } from "@/shared/utils/isDefined.js";
import { toIsoString } from "@/utils/toIsoString.js";
import { Types } from "mongoose";
import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl.js";

type ProjectOptionProject = {
  _id: Types.ObjectId;
  title: string;
  createdAt: Date;
  invitedUserIds: Types.ObjectId[];
};

type ProjectOptionUser = {
  _id: Types.ObjectId;
  avatarKey?: string;
  avatarStorageKey?: string;
};

type toProjectOptionDtoProps = {
  project: ProjectOptionProject;
  userId: string;
  usersById: Map<string, ProjectOptionUser>;
};

const toProjectOptionUserAvatarDto = (user: ProjectOptionUser) => ({
  id: user._id.toString(),
  avatarKey: user.avatarKey,
  avatarUrl: bulidPublicFileUrl(user.avatarStorageKey),
});

export const toProjectOptionDto = ({
  project,
  userId,
  usersById,
}: toProjectOptionDtoProps): ProjectOptionDto => {
  const users = project.invitedUserIds
    .map((id) => usersById.get(id.toString()))
    .filter(isDefined)
    .map((user) => toProjectOptionUserAvatarDto(user));

  return {
    id: project._id.toString(),
    title: project.title,
    createdAt: toIsoString(project.createdAt),
    users,
    isInvited: project.invitedUserIds.some((id) => id.toString() === userId),
  };
};
