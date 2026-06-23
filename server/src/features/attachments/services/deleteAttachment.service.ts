import {
  getProjectById,
  touchProject,
} from "@/features/projects/services/project.service.js";
import { AppError } from "@/utils/AppError.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { deleteFileFromR2 } from "@/features/attachments/services/attachmentStorage.service.js";
import { createActivity } from "@/features/activity/services/createActivity.service.js";

type DeleteAttachmentParams = {
  projectId: string;
  userId: string;
  workspaceId: string;
  attachmentId: string;
};

export const deleteAttachment = async ({
  projectId,
  userId,
  workspaceId,
  attachmentId,
}: DeleteAttachmentParams) => {
  const project = await getProjectById({
    projectId,
    workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const attachmentRecord = await AttachmentModel.findOne({
    _id: attachmentId,
    workspaceId,
    projectId,
  }).lean();

  if (!attachmentRecord) {
    throw new AppError("Attachment not found", 404);
  }

  await deleteFileFromR2(attachmentRecord.storageKey);

  const deletedAttachment = await AttachmentModel.deleteOne({
    _id: attachmentId,
    workspaceId,
    projectId,
  });

  await touchProject({ projectId, workspaceId });

  await createActivity({
    workspaceId,
    actorId: userId,
    type: "attachment.deleted",
    entityType: "attachment",
    entityId: attachmentId,
    metadata: {
        fileName: attachmentRecord.fileName
    }
  });

  return deletedAttachment;
};
