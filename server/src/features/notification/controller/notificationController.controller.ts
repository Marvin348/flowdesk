import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { notificationQuerySchema } from "@/features/notification/validators/notification.validator";
import { getNotifications } from "@/features/notification/services/getNotifications.service";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";

export const notificationController = async (req: Request, res: Response) => {
  const query = notificationQuerySchema.safeParse(req.query);

  if (!query.success) {
    throw new AppError("Invalid query", 400);
  }

  const { workspaceId, userId } = getAuthContext(req);

  const paginatedNotifications = await getNotifications({
    workspaceId,
    userId,
    query: query.data,
  });

  return res.status(200).json({ data: paginatedNotifications });
};
