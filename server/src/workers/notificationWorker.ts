import "dotenv/config";

import { Worker } from "bullmq";
import { bullMqConnection } from "@/shared/config/bullMq";
import { handleTaskCreatedNotification } from "@/features/notification/handlers/handleTaskCreatedNotification";
import { handleTaskUpdatedNotification } from "@/features/notification/handlers/handleTaskUpdatedNotification";
import { handleCreateProjectNotification } from "@/features/notification/handlers/handleCreateProjectNotification";
import { handleProjectMembersAddedNotification } from "@/features/notification/handlers/handleProjectMembersAddedNotification";
import { handleChangeUserRoleNotification } from "@/features/notification/handlers/handleChangeUserRoleNotification";
import { handleCommentReplyNotification } from "@/features/notification/handlers/handleCommentReplyNotification";
import { handleEmailChangedNotification } from "@/features/notification/handlers/handleEmailChangedNotification";
import { handlePasswordChangedNotification } from "@/features/notification/handlers/handlePasswordChangedNotification";
import { connectDb } from "@/shared/config/db";
import mongoose from "mongoose";

const startNotificationWorker = async () => {
  try {
    await connectDb();

    const worker = new Worker(
      "notifications",
      async (job) => {
        switch (job.name) {
          case "task-assigned":
            await handleTaskCreatedNotification(job.data);
            break;

          case "task-updated":
            await handleTaskUpdatedNotification(job.data);
            break;

          case "project-assigned":
            await handleCreateProjectNotification(job.data);
            break;

          case "project-members.assigned":
            await handleProjectMembersAddedNotification(job.data);
            break;

          case "comment-reply":
            await handleCommentReplyNotification(job.data);
            break;

          case "user-role.changed":
            await handleChangeUserRoleNotification(job.data);
            break;

          case "user-email.changed":
            await handleEmailChangedNotification(job.data);
            break;

          case "user-password.changed":
            await handlePasswordChangedNotification(job.data);
            break;

          default:
            throw new Error(`Unknown notification job: ${job.name}`);
        }
      },
      {
        connection: bullMqConnection,
      },
    );

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
