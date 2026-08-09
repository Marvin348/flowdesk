import { UserRole } from "@shared/types/user";
import { AppError } from "@/utils/AppError";
import { UserModel } from "@/features/users/models/user.modal";
import { toUserDto } from "@/features/users/mappers/user.mapper";
import mongoose, { Types } from "mongoose";
import { notificationQueue } from "@/queues/notificationQueue";

type UpdateUserRoleInput = {
  workspaceId: Types.ObjectId;
  targetUserId: string;
  role: UserRole;
  currentUserId: string;
};

export const updateUserRole = async ({
  workspaceId,
  targetUserId,
  role,
  currentUserId,
}: UpdateUserRoleInput) => {
  const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
  const targetUserObjectId = new mongoose.Types.ObjectId(targetUserId);

  if (targetUserId === currentUserId && role !== "admin") {
    throw new AppError("Admins cannot demote themselves", 403);
  }

  const user = await UserModel.findOne({
    _id: targetUserId,
    workspaceId,
  }).lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === role) {
    throw new AppError("User already has this role", 400);
  }

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: targetUserId, workspaceId },
    { $set: { role } },
    { returnDocument: "after" },
  ).lean();

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  await notificationQueue.add("user-role.changed", {
    actorId: currentUserObjectId.toString(),
    workspaceId: workspaceId.toString(),
    recipientId: targetUserObjectId.toString(),
    previousRole: user.role,
    currentRole: role,
  });

  return toUserDto(updatedUser);
};
