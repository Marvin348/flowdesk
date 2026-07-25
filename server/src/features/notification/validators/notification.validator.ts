import z from "zod";
import {
  DEFAULT_PAGE,
  MAX_PAGE_LIMIT,
  PAGE_LIMITS,
} from "@shared/constants/pagination";
import { NOTIFICATION_STATUS } from "@shared/types/dto/notification/notification.dto";

export const NotificationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_LIMIT)
    .default(PAGE_LIMITS.notifications),

  status: z.enum(NOTIFICATION_STATUS).default("all"),
});

export type NotificationQuery = z.infer<typeof NotificationQuerySchema>;
