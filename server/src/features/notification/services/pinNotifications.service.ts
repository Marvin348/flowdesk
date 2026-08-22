import { Types } from "mongoose";
import { NotificationModel } from "@/features/notification/models/notification.model";
import { AppError } from "@/utils/AppError";

type PinNotificationsInput = {
  userId: string;
  workspaceId: Types.ObjectId;
  notificationId: string;
  pinned: boolean;
};

export const pinNotifications = async ({
  userId,
  workspaceId,
  notificationId,
  pinned,
}: PinNotificationsInput) => {
  const updatedNotification = await NotificationModel.updateOne(
    {
      _id: notificationId,
      workspaceId,
      recipientId: userId,
    },
    {
      $set: { pinnedAt: pinned ? new Date() : null },
    },
  );

  if (updatedNotification.matchedCount === 0) {
    throw new AppError("Notification not found", 404);
  }
};
