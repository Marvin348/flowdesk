import { Types } from "mongoose";
import type {
  NotificationType,
  EntityType,
  NotificationMetadata,
} from "@shared/types/dto/notification/notification.dto";

export type NotificationAggregationItem = {
  _id: Types.ObjectId;

  type: NotificationType;
  entityType: EntityType;

  metadata?: NotificationMetadata;

  isRead: boolean;
  readAt?: Date;
  createdAt: Date;

  actor?: {
    _id: Types.ObjectId;
    name: string;
  };

  taskEntity?: {
    _id: Types.ObjectId;
    title: string;
    projectId: Types.ObjectId;
  };

  projectEntity?: {
    _id: Types.ObjectId;
    title: string;
  };
};

export type NotificationAggregationResult = {
  data: NotificationAggregationItem[];

  metaData: Array<{
    totalItems: number;
  }>;

  unreadMetaData: Array<{
    unreadCount: number;
  }>;
};
