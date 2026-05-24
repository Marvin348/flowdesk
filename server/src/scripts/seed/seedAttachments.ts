import type { SeedAttachment } from "@/scripts/seed/types.js";
import { requireMappedId } from "@/scripts/seed/seedUtils.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";

export const seedAttachments = async (
  attachments: SeedAttachment[],
  projectIdMap: Map<string, string>,
  taskIdMap: Map<string, string>,
  userIdMap: Map<string, string>,
) => {
  const attachmentIdMap = new Map<string, string>();

  for (const attachment of attachments) {
    const createdAttachment = await AttachmentModel.create({
      projectId: requireMappedId(
        projectIdMap,
        attachment.projectId,
        "attachment.projectId",
      ),

      taskId: attachment.taskId
        ? requireMappedId(taskIdMap, attachment.taskId, "attachment.taskId")
        : null,

      userId: requireMappedId(
        userIdMap,
        attachment.userId,
        "attachment.userId",
      ),

      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      mimeType: attachment.mimeType,
      fileSize: attachment.fileSize,

      createdAt: attachment.createdAt,
    });

    attachmentIdMap.set(attachment.id, createdAttachment._id.toString());
  }
};
