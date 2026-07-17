import { toProjectAttachmentsDto } from "@/features/attachments/mappers/projectAttachments.mapper";
import { AttachmentModel } from "@/features/attachments/models/attachment.model";
import { buildProjectAttachmentsPipeline } from "@/features/attachments/queries/projectAttachments.pipeline";
import mongoose, { Types } from "mongoose";
import type { ProjectAttachmentResponseDto } from "@shared/types/dto/projects/projectAttachments.dto";
import { getProjectById } from "@/features/projects/services/project.service";
import { AppError } from "@/utils/AppError";

type GetProjectAttachmentOverviewInput = {
  workspaceId: Types.ObjectId;
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
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const project = await getProjectById({
    projectId: projectObjectId,
    workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const pipeline = buildProjectAttachmentsPipeline({
    workspaceId,
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
