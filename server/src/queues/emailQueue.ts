import { bullMqConnection } from "@/shared/config/bullMq";
import { Queue } from "bullmq";

export const emailQueue = new Queue("email", {
  connection: bullMqConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: {
      count: 1000,
    },
    removeOnFail: {
      count: 5000,
    },
  },
});
