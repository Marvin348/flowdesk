import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import {
  notificationIdParamsSchema,
  pinNotificationSchema,
} from "@/features/notification/validators/notification.validator";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { pinNotifications } from "@/features/notification/services/pinNotifications.service";

export const pinNotificationController = async (
  req: Request,
  res: Response,
) => {
  const notificationId = notificationIdParamsSchema.safeParse(req.params);

  if (!notificationId.success) {
    throw new AppError("Invalid notificationId", 400);
  }

  const body = pinNotificationSchema.safeParse(req.body);

  if (!body.success) {
    throw new AppError("Invalid body", 400);
  }

  const { workspaceId, userId } = getAuthContext(req);

  await pinNotifications({
    workspaceId,
    userId,
    notificationId: notificationId.data.notificationId,
    pinned: body.data.pinned,
  });

  return res
    .status(200)
    .json({ message: "Notification pinned updated successfully" });
};
