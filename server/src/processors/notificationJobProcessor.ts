import type { Job } from "bullmq";
import { handleTaskCreatedNotification } from "@/features/notification/handlers/handleTaskCreatedNotification";
import { handleTaskUpdatedNotification } from "@/features/notification/handlers/handleTaskUpdatedNotification";
import { handleCreateProjectNotification } from "@/features/notification/handlers/handleCreateProjectNotification";
import { handleTaskDueSoonNotifications } from "@/features/notification/handlers/deadlines/handleTaskDueSoonNotifications";
import { handleTaskOverdueNotifications } from "@/features/notification/handlers/deadlines/handleTaskOverdueNotifications";
import { handleProjectDueSoonNotification } from "@/features/notification/handlers/deadlines/handleProjectDueSoonNotification";
import { handleProjectMembersAddedNotification } from "@/features/notification/handlers/handleProjectMembersAddedNotification";
import { handleChangeUserRoleNotification } from "@/features/notification/handlers/handleChangeUserRoleNotification";
import { handleCommentReplyNotification } from "@/features/notification/handlers/handleCommentReplyNotification";
import { handleEmailChangedNotification } from "@/features/notification/handlers/handleEmailChangedNotification";
import { handlePasswordChangedNotification } from "@/features/notification/handlers/handlePasswordChangedNotification";

export const processNotificationJob = async (job: Job) => {
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

    // deadlines
    case "task-due-soon":
      await handleTaskDueSoonNotifications(job.data);
      break;

    case "task-overdue":
      await handleTaskOverdueNotifications(job.data);
      break;

    case "project-due-soon":
      await handleProjectDueSoonNotification(job.data);
      break;

    default:
      throw new Error(`Unknown notification job: ${job.name}`);
  }
};
