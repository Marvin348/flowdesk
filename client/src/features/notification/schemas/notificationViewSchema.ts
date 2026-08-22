import { NOTIFICATION_VIEW } from "@shared/types/notificationSettings/notificationSettings";
import z from "zod";

export const notificationViewSchema = z
  .enum(NOTIFICATION_VIEW)
  .default("inbox");
