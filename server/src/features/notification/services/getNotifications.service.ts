import mongoose, { Types } from "mongoose";
import { NotificationQuery } from "@/features/notification/validators/notification.validator";
import { NotificationModel } from "@/features/notification/models/notification.model";
import { toNotificationDto } from "@/features/notification/mappers/notification.mapper";
import type { PaginatedNotificationsDto } from "@shared/types/dto/notification/getNotification.dto";
import { getNotificationPipeline } from "@/features/notification/queries/getNotification.pipeline";
import type { NotificationAggregationResult } from "@/features/notification/types/notificationAggregation";

type GetNotifications = {
  workspaceId: Types.ObjectId;
  userId: string;
  query: NotificationQuery;
};

export const getNotifications = async ({
  workspaceId,
  userId,
  query,
}: GetNotifications): Promise<PaginatedNotificationsDto> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const { page, limit } = query;

  const pipeline = getNotificationPipeline({
    workspaceId,
    recipientId: userObjectId,
    query,
  });

  const [result] =
    await NotificationModel.aggregate<NotificationAggregationResult>(pipeline);

  const notifications = result?.data ?? [];
  const totalItems = result?.metaData[0]?.totalItems ?? 0;
  const unreadCount = result?.unreadMetaData[0]?.unreadCount ?? 0;

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: notifications.map(toNotificationDto),
    unreadCount,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
    },
  };
};
