import { Types } from "mongoose";
import { UserNotificationSettingsParams } from "@/features/users/validators/changeUserNotificationSettingsSchema";
import { UserModel } from "@/features/users/models/user.modal";
import { AppError } from "@/utils/AppError";

type changeUserNotificationSettingsInput = {
  workspaceId: Types.ObjectId;
  userId: string;
  input: UserNotificationSettingsParams;
};

export const changeUserNotificationSettings = async ({
  workspaceId,
  userId,
  input,
}: changeUserNotificationSettingsInput) => {
  const updateNotificationSettings: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    updateNotificationSettings[`settings.notifications.${key}`] = value;
  }

  const user = await UserModel.findOneAndUpdate(
    {
      workspaceId,
      _id: userId,
    },
    {
      $set: updateNotificationSettings,
    },
    { returnDocument: "after", runValidators: true },
  );

  if(!user) {
    throw new AppError("User not found", 404)
  }
};
