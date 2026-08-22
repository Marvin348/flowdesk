import type { Request, Response } from "express";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { markAllNotificationsAsRead } from "@/features/notification/services/markAllNotificationsAsRead.service";

export const readAllNotificationController = async (
  req: Request,
  res: Response,
) => {
  const { workspaceId, userId } = getAuthContext(req);

  await markAllNotificationsAsRead({ workspaceId, userId });

  return res.status(200).json({ message: "Notifications all marked as read" });
};
