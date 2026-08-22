import z from "zod";
import {
  DEFAULT_PAGE,
  MAX_PAGE_LIMIT,
  PAGE_LIMITS,
} from "@shared/constants/pagination";
import { NOTIFICATION_STATUS } from "@shared/types/dto/notification/notification.dto";
import { NOTIFICATION_VIEW } from "@shared/types/notificationSettings/notificationSettings";
import { objectIdSchema } from "@/shared/validators/objectId.validator";

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_LIMIT)
    .default(PAGE_LIMITS.notifications),

  status: z.enum(NOTIFICATION_STATUS).default("all"),
  view: z.enum(NOTIFICATION_VIEW).default("inbox"),
});

export type NotificationQuery = z.infer<typeof notificationQuerySchema>;

export const notificationIdParamsSchema = z.object({
  notificationId: objectIdSchema,
});

export const pinNotificationSchema = z.object({
  pinned: z.boolean(),
});

export const archivedNotificationSchema = z.object({
  archived: z.boolean(),
});
