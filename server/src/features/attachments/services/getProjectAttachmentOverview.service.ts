import { toProjectAttachmentsDto } from "@/features/attachments/mappers/projectAttachments.mapper.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { buildProjectAttachmentsPipeline } from "@/features/attachments/queries/projectAttachments.pipeline.js";
import mongoose from "mongoose";
import type { ProjectAttachmentResponseDto } from "@shared/types/dto/projects/projectAttachments.dto.js";
import { getProjectById } from "@/features/projects/services/project.service.js";
import { AppError } from "@/utils/AppError.js";

type GetProjectAttachmentOverviewInput = {
  workspaceId: string;
  search: string;
  projectId: string;
  page: number;
  limit: number;
};

export const getProjectAttachmentOverview = async ({
  workspaceId,
  search,
  projectId,
  page,
  limit,
}: GetProjectAttachmentOverviewInput): Promise<ProjectAttachmentResponseDto> => {
  const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const project = await getProjectById({
    projectId,
    workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const pipeline = buildProjectAttachmentsPipeline({
    workspaceId: workspaceObjectId,
    projectId: projectObjectId,
    search,
    page,
    limit,
  });

  const [result] = await AttachmentModel.aggregate(pipeline);

  const totalItems = result.metaData[0]?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: result.data.map(toProjectAttachmentsDto),
    pagination: {
      totalPages,
      currentPage: page,
    },
  };
};
