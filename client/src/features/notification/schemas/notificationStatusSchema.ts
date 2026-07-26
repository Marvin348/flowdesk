import z from "zod";

export const notificationStatusSchema = z.enum(["all", "unread"]);
