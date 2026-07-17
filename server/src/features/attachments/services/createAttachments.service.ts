import {
  getProjectById,
  touchProject,
} from "@/features/projects/services/project.service";
import { AppError } from "@/utils/AppError";
import { TaskModel } from "@/features/tasks/models/task.model";
import { uploadFileToR2 } from "@/lib/storage/r2Storage";
import { AttachmentModel } from "@/features/attachments/models/attachment.model";
import { createActivity } from "@/features/activity/services/createActivity.service";
import { Types } from "mongoose";
import mongoose from "mongoose";

type CreateAttachmentInput = {
  projectId: string;
  userId: string;
  workspaceId: Types.ObjectId;
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
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const project = await getProjectById({
    projectId: projectObjectId,
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
    const storageKey = await uploadFileToR2(file, {
      prefix: "attachments",
      bucket: "private",
    });

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
