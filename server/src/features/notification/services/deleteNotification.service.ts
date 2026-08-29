import { Types } from "mongoose";
import { NotificationModel } from "@/features/notification/models/notification.model";
import { AppError } from "@/utils/AppError";

type DeleteNotificationInput = {
  notificationId: string;
  userId: string;
  workspaceId: Types.ObjectId;
};

export const deleteNotification = async ({
  notificationId,
  userId,
  workspaceId,
}: DeleteNotificationInput) => {
  const notification = await NotificationModel.findOneAndDelete({
    _id: notificationId,
    workspaceId,
    recipientId: userId,
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }
};
