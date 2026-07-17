import {
  UpdateCurrentUserInput,
  AppearanceSettingsInput,
} from "@/features/users/validators/user.validator";
import { UserModel } from "@/features/users/models/user.modal";
import {
  toUserDto,
  toAuthUserDto,
} from "@/features/users/mappers/user.mapper";
import { AppError } from "@/utils/AppError";
import { Types } from "mongoose";

type UpdateUserInput = {
  input: UpdateCurrentUserInput;
  userId: string;
  workspaceId: Types.ObjectId;
};

type UpdateAppearanceSettingsInput = {
  input: AppearanceSettingsInput;
  userId: string;
  workspaceId: Types.ObjectId;
};

export const updateCurrentUser = async ({
  input,
  userId,
  workspaceId,
}: UpdateUserInput) => {
  const user = await UserModel.findOneAndUpdate(
    {
      _id: userId,
      workspaceId,
    },
    {
      $set: input,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toUserDto(user);
};

export const updateAppearanceSettings = async ({
  input,
  userId,
  workspaceId,
}: UpdateAppearanceSettingsInput) => {
  const updateData: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    updateData[`appearanceSettings.${key}`] = value;
  }

  const user = await UserModel.findOneAndUpdate(
    { _id: userId, workspaceId },
    { $set: updateData },
    { returnDocument: "after", runValidators: true },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toAuthUserDto(user);
};

export const findUserInWorkspace = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: Types.ObjectId;
}) => {
  return await UserModel.findOne({ _id: userId, workspaceId }).lean();
};
