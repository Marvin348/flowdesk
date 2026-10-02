import { handleEmailDelivery } from "@/features/email/handlers/handleEmailDelivery";
import type { Job } from "bullmq";

export const emailJobProcessor = async (job: Job) => {
  switch (job.name) {
    case "account-verification":
      await handleEmailDelivery(job.data.deliveryId);
      break;

    case "email_change":
      await handleEmailDelivery(job.data.deliveryId);
      break;

    case "password_change":
      await handleEmailDelivery(job.data.deliveryId);
      break;

    default:
      throw new Error(`Unknown email job: ${job.name}`);
  }
};
