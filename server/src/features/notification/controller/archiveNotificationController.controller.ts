import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import {
  notificationIdParamsSchema,
  archivedNotificationSchema,
} from "@/features/notification/validators/notification.validator";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { archiveNotificatin } from "@/features/notification/services/archiveNotificatin.service";

export const archiveNotificationController = async (
  req: Request,
  res: Response,
) => {
  const notificationId = notificationIdParamsSchema.safeParse(req.params);

  if (!notificationId.success) {
    throw new AppError("Invalid notificationId", 400);
  }

  const body = archivedNotificationSchema.safeParse(req.body);

  if (!body.success) {
    throw new AppError("Invalid body", 400);
  }

  const { workspaceId, userId } = getAuthContext(req);

  await archiveNotificatin({
    userId,
    workspaceId,
    notificationId: notificationId.data.notificationId,
    archived: body.data.archived,
  });

  return res
    .status(200)
    .json({ message: "Notification archived successfully" });
};
