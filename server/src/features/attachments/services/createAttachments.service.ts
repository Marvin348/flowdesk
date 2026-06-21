import {
  getProjectById,
  touchProject,
} from "@/features/projects/services/project.service.js";
import { AppError } from "@/utils/AppError.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { uploadFileToR2 } from "@/features/attachments/services/attachmentStorage.service.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { createActivity } from "@/features/activity/services/createActivity.service.js";

type CreateAttachmentInput = {
  projectId: string;
  userId: string;
  workspaceId: string;
  taskId: string | null;
  files: Express.Multer.File[];
};

export const createAttachments = async ({
  projectId,
  userId,
  workspaceId,
  taskId,
  files,
}: CreateAttachmentInput) => {
  const project = await getProjectById({
    projectId,
    userId,
    workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (taskId) {
    const task = await TaskModel.findOne({
      _id: taskId,
      workspaceId,
      projectId,
    }).lean();

    if (!task) {
      throw new AppError("Task not found", 404);
    }
  }

  const attachmentsToCreate = [];

  for (const file of files) {
    const storageKey = await uploadFileToR2(file);

    attachmentsToCreate.push({
      workspaceId,
      projectId,
      taskId,
      userId,
      fileName: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      fileSize: file.size,
    });
  }

  const createdAttachments =
    await AttachmentModel.insertMany(attachmentsToCreate);

  await touchProject({ projectId: project.id, workspaceId });

  for (const attachment of createdAttachments) {
    await createActivity({
      workspaceId,
      actorId: userId,
      type: "attachment.uploaded",
      entityType: "attachment",
      entityId: attachment._id.toString(),
      metadata: {
        projectId,
        taskId,
        fileName: attachment.fileName,
      },
    });
  }

  return createdAttachments;
};
