import { CreateProjectParams } from "@/features/projects/validation/project.validator";
import { ProjectModel } from "@/features/projects/models/project.model";
import { toProjectDto } from "@/features/projects/mappers/project.mapper";
import { createActivity } from "@/features/activity/services/createActivity.service";
import { AppError } from "@/utils/AppError";
import { UserModel } from "@/features/users/models/user.modal";
import { Types } from "mongoose";

type CreateProjectInput = {
  input: CreateProjectParams;
  workspaceId: Types.ObjectId;
  userId: string;
};

export const createProject = async ({
  input,
  workspaceId,
  userId,
}: CreateProjectInput) => {
  const {
    title,
    dueDate,
    projectStatus,
    priority,
    invitedUserIds,
    description,
  } = input;

  const uniqueUserIds = [...new Set(invitedUserIds)];

  const matchingUsers = await UserModel.countDocuments({
    _id: { $in: uniqueUserIds },
    workspaceId,
  });

  if (matchingUsers !== uniqueUserIds.length) {
    throw new AppError("One or more users are invalid", 400);
  }

  const newProject = await ProjectModel.create({
    workspaceId,
    title,
    priority,
    ownerId: userId,
    projectStatus,
    dueDate,
    invitedUserIds,
    description,
  });

  await createActivity({
    workspaceId,
    actorId: userId,
    type: "project.created",
    entityType: "project",
    entityId: newProject._id.toString(),
    metadata: {
      projectTitle: newProject.title,
      projectStatus: newProject.projectStatus,
      priority: newProject.priority,
    },
  });

  return toProjectDto(newProject.toObject());
};
