import { ProjectModel } from "@/features/projects/models/project.model.js";
import {
  toProjectDtos,
  toProjectDto,
} from "@/features/projects/mappers/project.mapper.js";

export const touchProject = async (projectId: string) => {
  await ProjectModel.findOneAndUpdate(
    { id: projectId },
    { updatedAt: new Date() },
  );
};

export const getProjects = async (userId: string) => {
  const projectRecords = await ProjectModel.find({
    $or: [{ ownerId: userId }, { invitedUserIds: userId }],
  }).lean();

  return toProjectDtos(projectRecords);
};

export const getProjectById = async ({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) => {
  const projectRecord = await ProjectModel.findOne({
    _id: projectId,
    $or: [{ ownerId: userId }, { invitedUserIds: userId }],
  }).lean();

  if (!projectRecord) {
    return null;
  }

  return toProjectDto(projectRecord);
};
