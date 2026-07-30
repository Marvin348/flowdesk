import { processTaskDueSoonNotifications } from "@/features/notification/services/deadlines/processTaskDueSoonNotifications.service";
import { processTaskOverdueNotifications } from "@/features/notification/services/deadlines/processTaskOverdueNotifications.service";
import { processProjectDueSoonNotifications } from "@/features/notification/services/deadlines/processProjectDueSoonNotifications.service";

export const runDeadlineJob = async () => {
  await processTaskDueSoonNotifications();
  await processTaskOverdueNotifications();
  await processProjectDueSoonNotifications();
};
