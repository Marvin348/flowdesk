import { UserRole } from "@shared/types/user";
import { ProjectModel } from "@/features/projects/models/project.model";
import { AppError } from "@/utils/AppError";
import mongoose from "mongoose";
import { TaskModel } from "@/features/tasks/models/task.model";
import { AttachmentModel } from "@/features/attachments/models/attachment.model";
import { CommentModel } from "@/features/comments/models/comment.model";
import { Types } from "mongoose";

type RemoveProjectMemberInput = {
  workspaceId: Types.ObjectId;
  userId: string;
  role: UserRole;
  projectId: string;
};

export const removeProjectMember = async ({
  workspaceId,
  userId,
  role,
  projectId,
}: RemoveProjectMemberInput) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  if (role !== "admin") {
    throw new AppError("Only admins can delete user", 403);
  }

  const project = await ProjectModel.findOne({
    _id: projectObjectId,
    workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const isProjectMember = project.invitedUserIds.some((id) =>
    id.equals(userObjectId),
  );

  if (!isProjectMember) {
    throw new AppError("User is not a project member", 400);
  }

  const updatedProject = await ProjectModel.findOneAndUpdate(
    { _id: projectObjectId, workspaceId },
    {
      $pull: {
        invitedUserIds: userObjectId,
      },
    },
    { returnDocument: "after" },
  ).lean();

  if (!updatedProject) {
    throw new AppError("Project not found", 404);
  }

  await TaskModel.updateMany(
    {
      workspaceId,
      projectId: projectObjectId,
      collaboratorIds: userObjectId,
    },
    {
      $pull: {
        collaboratorIds: userObjectId,
      },
    },
  );

  // Delete tasks that have no collaborators after removing the user
  const tasksWithoutCollaborators = await TaskModel.find({
    workspaceId,
    projectId: projectObjectId,
    collaboratorIds: { $size: 0 },
  }).lean();

  const taskIdsToDelete = tasksWithoutCollaborators.map((task) => task._id);

  if (taskIdsToDelete.length > 0) {
    await AttachmentModel.deleteMany({
      workspaceId,
      projectId: projectObjectId,
      taskId: { $in: taskIdsToDelete },
    });

    await CommentModel.deleteMany({
      workspaceId,
      taskId: { $in: taskIdsToDelete },
    });

    await TaskModel.deleteMany({
      workspaceId,
      projectId: projectObjectId,
      _id: { $in: taskIdsToDelete },
    });
  }
};
