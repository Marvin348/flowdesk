import { processProjectDueSoonNotifications } from "@/features/notification/services/deadlines/processProjectDueSoonNotifications.service";
import { processTaskDueSoonNotifications } from "@/features/notification/services/deadlines/processTaskDueSoonNotifications.service";
import { processTaskOverdueNotifications } from "@/features/notification/services/deadlines/processTaskOverdueNotifications.service";

export const runDeadlineJob = async () => {
  await processProjectDueSoonNotifications();
  await processTaskDueSoonNotifications();
  await processTaskOverdueNotifications();
};
