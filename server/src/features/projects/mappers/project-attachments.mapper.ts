import { Attachment } from "@shared/types/attachment.js";
import type { ProjectAttachmentDto } from "@shared/types/dto/projects/projectAttachments.dto.js";
import { Task } from "@shared/types/task.js";
import { User } from "@shared/types/user.js";

export const toProjectAttachmentsDto = (
  attachments: Attachment[],
  usersById: Map<string, User>,
  taskById: Map<string, Task>,
): ProjectAttachmentDto[] => {
  return attachments.map((a) => {
    // Safe because caller validates that every attachment.userId exists.
    const user = usersById.get(a.userId)!;
    const task = a.taskId ? taskById.get(a.taskId) : null;

    return {
      id: a.id,
      projectId: a.projectId,
      taskId: a.taskId ?? null,
      userId: a.userId,
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      mimeType: a.mimeType,
      fileSize: a.fileSize,
      uploadedAt: a.createdAt,

      task: task
        ? {
            id: task.id,
            title: task.title,
          }
        : null,

      uploadedBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarKey: user.avatarKey,
        avatarUrl: user.avatarUrl,
      },
    };
  });
};
