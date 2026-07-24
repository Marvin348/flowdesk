import {
  NOTIFICATION_TYPES,
  NOTIFICATION_ENTITY_TYPES,
} from "@shared/types/dto/notification/notification.dto";
import mongoose from "mongoose";
import type { NotificationDocument } from "@/features/notification/types/notification.document";
import { USER_ROLE } from "@shared/types/user";

const notificationSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: NOTIFICATION_TYPES,
    },

    entityType: {
      type: String,
      required: true,
      enum: NOTIFICATION_ENTITY_TYPES,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    metadata: {
      type: {
        previousRole: {
          type: String,
          enum: USER_ROLE,
        },
        currentRole: {
          type: String,
          enum: USER_ROLE,
        },
      },
      required: false,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  workspaceId: 1,
  recipientId: 1,
  createdAt: -1,
});

export const NotificationModel = mongoose.model<NotificationDocument>(
  "Notification",
  notificationSchema,
);
