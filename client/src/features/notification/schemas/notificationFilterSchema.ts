import {
  NOTIFICATION_VIEW,
  NOTIFICATION_FILTER_TYPE,
} from "@shared/types/notificationSettings/notificationSettings";
import z from "zod";

export const notificationViewSchema = z
  .enum(NOTIFICATION_VIEW)
  .default("inbox");

export const notificationFilterTypeSchema = z.enum(NOTIFICATION_FILTER_TYPE);
