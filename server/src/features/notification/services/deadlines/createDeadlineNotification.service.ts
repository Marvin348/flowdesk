import { Types } from "mongoose";
import { NotificationModel } from "@/features/notification/models/notification.model";
import { MongoServerError } from "mongodb";

type CreateDeadlineNotificationInput = {
  workspaceId: Types.ObjectId;
  recipientId: Types.ObjectId;
  entityId: Types.ObjectId;
  projectId?: Types.ObjectId;
  type: "task_due_soon" | "task_overdue" | "project_due_soon";
  entityType: "task" | "project";
  deadlineAt: Date;
};

export const createDeadlineNotification = async ({
  workspaceId,
  recipientId,
  entityId,
  projectId,
  type,
  entityType,
  deadlineAt,
}: CreateDeadlineNotificationInput) => {
  try {
    await NotificationModel.create({
      workspaceId,
      recipientId,
      entityId,
      type,
      entityType,
      projectId,
      deadlineAt,
    });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return;
    }

    throw error;
  }
};
