import { UserModel } from "@/features/users/models/user.modal";
import type { NotificationType } from "@shared/types/dto/notification/notification.dto";
import { Types } from "mongoose";
import { notificationSettingByType } from "@/features/notification/constants/notificationSettingByType";

type ShouldCreateNotificationInput = {
  type: NotificationType;
  recipientId: Types.ObjectId;
  workspaceId: Types.ObjectId;
};

export const shouldCreateNotification = async ({
  type,
  recipientId,
  workspaceId,
}: ShouldCreateNotificationInput) => {
  const settingKey = notificationSettingByType[type];

  if (settingKey === null) {
    return true;
  }

  const user = await UserModel.findOne({ _id: recipientId, workspaceId })
    .select("settings.notifications")
    .lean();

  if (!user) {
    return false;
  }

  return user.settings.notifications[settingKey];
};
