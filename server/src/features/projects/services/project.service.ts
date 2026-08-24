import { ProjectModel } from "@/features/projects/models/project.model";
import {
  toProjectDtos,
  toProjectDto,
} from "@/features/projects/mappers/project.mapper";
import { Types } from "mongoose";
import type { TouchProjectInput } from "@/features/projects/types/projects";

export const touchProject = async ({
  projectId,
  workspaceId,
  session,
}: TouchProjectInput) => {
  await ProjectModel.findOneAndUpdate(
    { _id: projectId, workspaceId },
    { updatedAt: new Date() },
    { session },
  );
};

export const getProjects = async ({
  workspaceId,
}: {
  workspaceId: Types.ObjectId;
}) => {
  const projectRecords = await ProjectModel.find({
    workspaceId,
  }).lean();

  return toProjectDtos(projectRecords);
};

export const getProjectById = async ({
  projectId,
  workspaceId,
}: {
  projectId: Types.ObjectId;
  workspaceId: Types.ObjectId;
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
