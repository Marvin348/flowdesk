import "dotenv/config";

import { bullMqConnection } from "@/shared/config/bullMq";
import { connectDb } from "@/shared/config/db";
import { connectRedis } from "@/shared/config/redis";
import { Worker } from "bullmq";
import { emailJobProcessor } from "@/processors/emailJobProcessor";
import mongoose from "mongoose";

export const startEmailWorker = async () => {
  try {
    await connectDb();
    await connectRedis();

    const emailWorker = new Worker("email", emailJobProcessor, {
      connection: bullMqConnection,
    });

    emailWorker.on("failed", (job, error) => {
      console.error(`Email job ${job?.id ?? "unknown"} failed:`, error);
    });

    emailWorker.on("error", (error) => {
      console.error("Email worker error:", error);
    });

    console.log("Email worker started.");

    const shutdown = async () => {
      console.log("Shutting down email worker...");

      await emailWorker.close();
      await mongoose.disconnect();

      console.log("Email worker stopped.");

      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Email worker failed to start:", error);
    process.exitCode = 1;
  }
};

startEmailWorker();
