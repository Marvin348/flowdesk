import { Types } from "mongoose";
import { NotificationModel } from "../models/notification.model";
import { AppError } from "@/utils/AppError";

type ArchiveNotificatinInput = {
  userId: string;
  workspaceId: Types.ObjectId;
  archived: boolean;
  notificationId: string;
};

export const archiveNotificatin = async ({
  userId,
  workspaceId,
  archived,
  notificationId,
}: ArchiveNotificatinInput) => {
  const updatedNotification = await NotificationModel.updateOne(
    {
      _id: notificationId,
      workspaceId,
      recipientId: userId,
    },
    {
      $set: { archivedAt: archived ? new Date() : null },
    },
  );

  if (updatedNotification.matchedCount === 0) {
    throw new AppError("Notification not found", 404);
  }
};
