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

    deadlineAt: {
      type: Date,
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

notificationSchema.index(
  {
    recipientId: 1,
    type: 1,
    entityId: 1,
    deadlineAt: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      type: {
        $in: ["task_due_soon", "task_overdue", "project_due_soon"],
      },
      deadlineAt: { $type: "date" },
    },
  },
);

notificationSchema.index(
  {
    recipientId: 1,
    type: 1,
    entityId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      type: {
        $in: [
          "task_assigned",
          "project_assigned",
          "comment_mention",
          "comment_reply",
          "role_changed",
          "password_changed",
          "email_changed",
        ],
      },
    },
  },
);

export const NotificationModel = mongoose.model<NotificationDocument>(
  "Notification",
  notificationSchema,
);
