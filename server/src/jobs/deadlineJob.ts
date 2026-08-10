import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "@/shared/config/db";
import { runDeadlineJob } from "@/features/notification/jobs/runDeadlineJob";
import { notificationQueue } from "@/queues/notificationQueue";

const startDeadlineJob = async () => {
  try {
    await connectDb();
    await runDeadlineJob();

    console.log("Deadline job completed.");
  } catch (error) {
    console.error("Deadline job failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    await notificationQueue.close();
  }
};

startDeadlineJob();
