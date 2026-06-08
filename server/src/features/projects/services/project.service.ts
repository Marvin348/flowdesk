import { ProjectModel } from "@/features/projects/models/project.model.js";
import {
  toProjectDtos,
  toProjectDto,
} from "@/features/projects/mappers/project.mapper.js";

export const touchProject = async ({
  projectId,
  workspaceId,
}: {
  projectId: string;
  workspaceId: string;
}) => {
  await ProjectModel.findOneAndUpdate(
    { _id: projectId, workspaceId },
    { updatedAt: new Date() },
  );
};

export const getProjects = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) => {
  const projectRecords = await ProjectModel.find({
    workspaceId,
    $or: [{ ownerId: userId }, { invitedUserIds: userId }],
  }).lean();

  return toProjectDtos(projectRecords);
};

export const getProjectById = async ({
  projectId,
  userId,
  workspaceId,
}: {
  projectId: string;
  userId: string;
  workspaceId: string;
}) => {
  const projectRecord = await ProjectModel.findOne({
    _id: projectId,
    workspaceId,
    $or: [{ ownerId: userId }, { invitedUserIds: userId }],
  }).lean();

  if (!projectRecord) {
    return null;
  }

  return toProjectDto(projectRecord);
};
