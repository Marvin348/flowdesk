import { Types } from "mongoose";
import mongoose from "mongoose";
import { NotificationModel } from "../models/notification.model";
import { AppError } from "@/utils/AppError";

type MarkAllNotificationsAsReadInput = {
  workspaceId: Types.ObjectId;
  userId: string;
};

export const markAllNotificationsAsRead = async ({
  workspaceId,
  userId,
}: MarkAllNotificationsAsReadInput) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  await NotificationModel.updateMany(
    {
      workspaceId,
      recipientId: userObjectId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );
};
