import { AppError } from "@/utils/AppError";
import { UserRole } from "@shared/types/user";
import mongoose from "mongoose";
import { UserModel } from "@/features/users/models/user.modal";
import { ProjectModel } from "@/features/projects/models/project.model";
import { Types } from "mongoose";

type AssignProjectsToUserParams = {
  workspaceId: Types.ObjectId;
  role: UserRole;
  userId: string;
  projectIdsToAdd: string[];
};

export const assignProjectsToUser = async ({
  workspaceId,
  role,
  userId,
  projectIdsToAdd,
}: AssignProjectsToUserParams) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (role !== "admin") {
    throw new AppError("Only admins can assign new projects", 403);
  }

  const user = await UserModel.exists({ _id: userObjectId, workspaceId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const uniqueProjectIds = [...new Set(projectIdsToAdd)];

  const projectObjectIds = uniqueProjectIds.map(
    (id) => new mongoose.Types.ObjectId(id),
  );

  const matchingProjectCount = await ProjectModel.countDocuments({
    workspaceId,
    _id: { $in: projectObjectIds },
  }).lean();

  if (matchingProjectCount !== uniqueProjectIds.length) {
    throw new AppError("One or more projects are missing", 400);
  }

  const alreadyAssignedProject = await ProjectModel.exists({
    workspaceId,
    _id: { $in: projectObjectIds },
    invitedUserIds: userObjectId,
  });

  if (alreadyAssignedProject) {
    throw new AppError("User already in project", 409);
  }

  await ProjectModel.updateMany(
    {
      _id: { $in: projectObjectIds },
      workspaceId,
    },
    {
      $addToSet: {
        invitedUserIds: userObjectId,
      },
    },
  );
};
