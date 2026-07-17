import type { SeedAttachment } from "@/scripts/seed/types";
import { requireMappedId } from "@/scripts/seed/seedUtils";
import { AttachmentModel } from "@/features/attachments/models/attachment.model";
import { Types } from "mongoose";

type SeedAttachmentInput = {
  attachments: SeedAttachment[];
  projectIdMap: Map<string, string>;
  taskIdMap: Map<string, string>;
  userIdMap: Map<string, string>;
  workspaceId: Types.ObjectId;
};

export const seedAttachments = async ({
  attachments,
  projectIdMap,
  taskIdMap,
  userIdMap,
  workspaceId,
}: SeedAttachmentInput) => {
  const attachmentIdMap = new Map<string, string>();

  for (const attachment of attachments) {
    const createdAttachment = await AttachmentModel.create({
      projectId: requireMappedId(
        projectIdMap,
        attachment.projectId,
        "attachment.projectId",
      ),

      workspaceId,

      taskId: attachment.taskId
        ? requireMappedId(taskIdMap, attachment.taskId, "attachment.taskId")
        : null,

      userId: requireMappedId(
        userIdMap,
        attachment.userId,
        "attachment.userId",
      ),

      fileName: attachment.fileName,
      storageKey: attachment.storageKey,
      mimeType: attachment.mimeType,
      fileSize: attachment.fileSize,

      createdAt: attachment.createdAt,
    });

    attachmentIdMap.set(attachment.id, createdAttachment._id.toString());
  }
};
