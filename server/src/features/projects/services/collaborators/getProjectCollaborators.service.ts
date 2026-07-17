import { Types } from "mongoose";
import mongoose from "mongoose";
import { ProjectCollaboratorQuery } from "@/features/projects/validation/projectCollaboratorSchema.validator";
import { buildProjectCollaboratorPipeline } from "@/features/projects/queries/collaborators/projectCollaborator.pipeline";
import { ProjectModel } from "@/features/projects/models/project.model";
import { AppError } from "@/utils/AppError";
import { toUserDto } from "@/features/users/mappers/user.mapper";

type ProjectCollaboratorsInput = {
  workspaceId: Types.ObjectId;
  projectId: string;
  query: ProjectCollaboratorQuery;
};

export const getProjectCollaborators = async ({
  workspaceId,
  projectId,
  query,
}: ProjectCollaboratorsInput) => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const pipeline = buildProjectCollaboratorPipeline({
    workspaceId,
    projectId: projectObjectId,
    query,
  });

  const [result] = await ProjectModel.aggregate(pipeline);

  if (!result) {
    throw new AppError("Project not found", 404);
  }

  const totalItems = result.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / query.limit);

  return {
    items: result.collaborators.map(toUserDto),
    pagination: {
      currentPage: query.page,
      totalPages,
    },
  };
};
