import mongoose, { Types } from "mongoose";
import { NotificationModel } from "../models/notification.model";
import { AppError } from "@/utils/AppError";

type GetUnreadNotificationCountInput = {
  workspaceId: Types.ObjectId;
  userId: string;
};

export const getUnreadNotificationCount = async ({
  workspaceId,
  userId,
}: GetUnreadNotificationCountInput) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const unreadCount = await NotificationModel.countDocuments({
    workspaceId,
    recipientId: objectUserId,
    isRead: false,
  });

  return unreadCount;
};
