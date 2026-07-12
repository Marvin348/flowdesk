import { AppError } from "@/utils/AppError.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { deleteFileFromR2, uploadFileToR2 } from "@/lib/storage/r2Storage.js";
import {
  toUserDto,
} from "@/features/users/mappers/user.mapper.js";
import { Types } from "mongoose";

type UploadAvatarInput = {
  userId: string;
  workspaceId: Types.ObjectId;
  avatarFile: Express.Multer.File;
};

export const uploadAvatar = async ({
  userId,
  workspaceId,
  avatarFile,
}: UploadAvatarInput) => {
  const user = await UserModel.findOne({ _id: userId, workspaceId });

  if (!user) {
    throw new AppError("User not found", 400);
  }

  const oldAvatarStorageKey = user.avatarStorageKey;

  const newStorageKey = await uploadFileToR2(avatarFile, {
    prefix: "avatars",
    bucket: "public",
  });

  user.avatarStorageKey = newStorageKey;
  await user.save();

  if (oldAvatarStorageKey) {
    await deleteFileFromR2({
      storageKey: oldAvatarStorageKey,
      bucket: "public",
    });
  }

  return toUserDto(user);
};
