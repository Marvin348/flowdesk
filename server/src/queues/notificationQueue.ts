import { Queue } from "bullmq";
import { bullMqConnection } from "@/shared/config/bullMq";

export const notificationQueue = new Queue("notifications", {
  connection: bullMqConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});
