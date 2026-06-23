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

export const getProjects = async ({ workspaceId }: { workspaceId: string }) => {
  const projectRecords = await ProjectModel.find({
    workspaceId,
  }).lean();

  return toProjectDtos(projectRecords);
};

export const getProjectById = async ({
  projectId,
  workspaceId,
}: {
  projectId: string;
  workspaceId: string;
}) => {
  const projectRecord = await ProjectModel.findOne({
    _id: projectId,
    workspaceId,
  }).lean();

  if (!projectRecord) {
    return null;
  }

  return toProjectDto(projectRecord);
};
