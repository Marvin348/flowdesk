import { UserRole } from "@shared/types/user.js";
import { Types } from "mongoose";
import mongoose from "mongoose";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { AppError } from "@/utils/AppError.js";
import { UserModel } from "@/features/users/models/user.modal.js";

type AddProjectMembersInput = {
  workspaceId: Types.ObjectId;
  role: UserRole;
  projectId: string;
  userIdsToAdd: string[];
};

export const addProjectMembers = async ({
  workspaceId,
  role,
  projectId,
  userIdsToAdd,
}: AddProjectMembersInput) => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  if (role !== "admin") {
    throw new AppError("Only admins can update invitedUsers", 403);
  }

  const project = await ProjectModel.exists({
    workspaceId,
    _id: projectObjectId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const uniqueUserIds = [...new Set(userIdsToAdd)];

  const userObjectIds = uniqueUserIds.map(
    (id) => new mongoose.Types.ObjectId(id),
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
};
