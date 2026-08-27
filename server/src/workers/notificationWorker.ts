import "dotenv/config";

import { Worker } from "bullmq";
import { bullMqConnection } from "@/shared/config/bullMq";
import { connectDb } from "@/shared/config/db";
import mongoose from "mongoose";
import { processNotificationJob } from "@/processors/notificationJobProcessor";
import { connectRedis } from "@/shared/config/redis";

const startNotificationWorker = async () => {
  try {
    await connectDb();
    await connectRedis();

    const worker = new Worker("notifications", processNotificationJob, {
      connection: bullMqConnection,
    });

    console.log("Notification worker started.");

    const shutdown = async () => {
      console.log("Shutting down notification worker...");

      await worker.close();
      await mongoose.disconnect();

      console.log("Notification worker stopped.");

      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Notification worker failed to start:", error);
    process.exitCode = 1;
  }
};

startNotificationWorker();
