import { UserRole } from "@shared/types/user";
import { Types } from "mongoose";
import mongoose from "mongoose";
import { ProjectModel } from "@/features/projects/models/project.model";
import { AppError } from "@/utils/AppError";
import { UserModel } from "@/features/users/models/user.modal";
import { notificationQueue } from "@/queues/notificationQueue";

type AddProjectMembersInput = {
  workspaceId: Types.ObjectId;
  role: UserRole;
  userId: string;
  projectId: string;
  userIdsToAdd: string[];
};

export const addProjectMembers = async ({
  workspaceId,
  role,
  userId,
  projectId,
  userIdsToAdd,
}: AddProjectMembersInput) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  if (role !== "admin") {
    throw new AppError("Only admins can update invitedUsers", 403);
  }

  const uniqueUserIds = [...new Set(userIdsToAdd)];

  const userObjectIds = uniqueUserIds.map(
    (id) => new mongoose.Types.ObjectId(id),
  );

  const existingProject = await ProjectModel.findOne({
    workspaceId,
    _id: projectObjectId,
  }).select("invitedUserIds");

  if (!existingProject) {
    throw new AppError("Project not found", 404);
  }

  const addedUserIds = userObjectIds.filter(
    (newId) =>
      !existingProject.invitedUserIds.some((existingId) =>
        existingId.equals(newId),
      ),
  );

  const matchingUserCount = await UserModel.countDocuments({
    workspaceId,
    _id: { $in: userObjectIds },
  });

  if (matchingUserCount !== uniqueUserIds.length) {
    throw new AppError("One or more users are invalid", 400);
  }

  await ProjectModel.findOneAndUpdate(
    { _id: projectObjectId, workspaceId },
    {
      $addToSet: {
        invitedUserIds: { $each: userObjectIds },
      },
    },
    { returnDocument: "after" },
  );

  if (addedUserIds.length > 0) {
    await notificationQueue.add("project-members.assigned", {
      actorId: userObjectId.toString(),
      workspaceId: workspaceId.toString(),
      projectId: projectObjectId.toString(),
      addedUserIds: addedUserIds.map((id) => id.toString()),
    });
  }
};
