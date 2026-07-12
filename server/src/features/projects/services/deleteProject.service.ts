import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { AppError } from "@/utils/AppError.js";
import { getProjectById } from "@/features/projects/services/project.service.js";
import { createActivity } from "@/features/activity/services/createActivity.service.js";
import { UserRole } from "@shared/types/user.js";
import { Types } from "mongoose";

type DeleteProjectInput = {
  projectId: Types.ObjectId;
  userId: string;
  role: UserRole;
  workspaceId: Types.ObjectId;
};

export const deleteProject = async ({
  projectId,
  userId,
  role,
  workspaceId,
}: DeleteProjectInput) => {
  const project = await getProjectById({
    projectId,
    workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (role !== "admin") {
    throw new AppError("Only admins can delete projects", 403);
  }

  const tasksToDelete = await TaskModel.find({ projectId, workspaceId });
  const taskIdsToDelete = tasksToDelete.map((t) => t._id.toString());

  await CommentModel.deleteMany({
    workspaceId,
    taskId: { $in: taskIdsToDelete },
  });

  await AttachmentModel.deleteMany({
    workspaceId,
    projectId,
  });

  await TaskModel.deleteMany({ projectId, workspaceId });

  const deletedProject = await ProjectModel.findOneAndDelete({
    workspaceId,
    _id: projectId,
  });

  if (!deletedProject) {
    throw new AppError("Project not found", 404);
  }

  await createActivity({
    workspaceId,
    actorId: userId,
    type: "project.deleted",
    entityType: "project",
    entityId: deletedProject._id.toString(),
    metadata: {
      projectTitle: deletedProject.title,
    },
  });

  return {
    id: deletedProject._id.toString(),
  };
};
