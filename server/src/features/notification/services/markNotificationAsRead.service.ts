import { Types } from "mongoose";
import { NotificationModel } from "../models/notification.model";
import { AppError } from "@/utils/AppError";

type MarkNotificationAsReadInput = {
  workspaceId: Types.ObjectId;
  userId: string;
  notificationId: string;
};

export const markNotificationAsRead = async ({
  workspaceId,
  userId,
  notificationId,
}: MarkNotificationAsReadInput) => {
  const notification = await NotificationModel.findOne({
    _id: notificationId,
    workspaceId,
    recipientId: userId,
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (notification.isRead) {
    return notification;
  }

  notification.isRead = true;
  notification.readAt = new Date();

  await notification.save();
};
