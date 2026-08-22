import type { Request, Response } from "express";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { notificationIdParamsSchema } from "@/features/notification/validators/notification.validator";
import { AppError } from "@/utils/AppError";
import { markNotificationAsRead } from "@/features/notification/services/markNotificationAsRead.service";

export const markNotificationAsReadController = async (
  req: Request,
  res: Response,
) => {
  const notificationId = notificationIdParamsSchema.safeParse(req.params);

  if (!notificationId.success) {
    throw new AppError("Invalid notificationId", 400);
  }

  const { workspaceId, userId } = getAuthContext(req);

  await markNotificationAsRead({
    workspaceId,
    userId,
    notificationId: notificationId.data.notificationId,
  });

  return res.status(200).json({ message: "Notification marked as read" });
};
