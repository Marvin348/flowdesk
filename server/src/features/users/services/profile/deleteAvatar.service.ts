import { UserModel } from "@/features/users/models/user.modal";
import { deleteFileFromR2 } from "@/lib/storage/r2Storage";
import { AppError } from "@/utils/AppError";
import { Types } from "mongoose";

type DeleteAvatarInput = {
  userId: string;
  workspaceId: Types.ObjectId;
};

export const deleteAvatar = async ({
  userId,
  workspaceId,
}: DeleteAvatarInput) => {
  const user = await UserModel.findOne({ _id: userId, workspaceId });

  if (!user) {
    throw new AppError("User not found", 400);
  }

  const oldAvatarStorageKey = user.avatarStorageKey;

  if (!oldAvatarStorageKey) {
    return;
  }

  user.avatarStorageKey = undefined;
  await user.save();

  await deleteFileFromR2({
    storageKey: oldAvatarStorageKey,
    bucket: "public",
  });
};
