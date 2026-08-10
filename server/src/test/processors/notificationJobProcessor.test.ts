import type { Job } from "bullmq";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock(
  "@/features/notification/handlers/handleTaskCreatedNotification",
  () => ({
    handleTaskCreatedNotification: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/handleTaskUpdatedNotification",
  () => ({
    handleTaskUpdatedNotification: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/handleCreateProjectNotification",
  () => ({
    handleCreateProjectNotification: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/handleProjectMembersAddedNotification",
  () => ({
    handleProjectMembersAddedNotification: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/handleCommentReplyNotification",
  () => ({
    handleCommentReplyNotification: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/handleChangeUserRoleNotification",
  () => ({
    handleChangeUserRoleNotification: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/handleEmailChangedNotification",
  () => ({
    handleEmailChangedNotification: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/handlePasswordChangedNotification",
  () => ({
    handlePasswordChangedNotification: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/deadlines/handleTaskDueSoonNotifications",
  () => ({
    handleTaskDueSoonNotifications: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/deadlines/handleTaskOverdueNotifications",
  () => ({
    handleTaskOverdueNotifications: vi.fn(),
  }),
);

vi.mock(
  "@/features/notification/handlers/deadlines/handleProjectDueSoonNotification",
  () => ({
    handleProjectDueSoonNotification: vi.fn(),
  }),
);

import { processNotificationJob } from "@/processors/notificationJobProcessor";
import { handleTaskCreatedNotification } from "@/features/notification/handlers/handleTaskCreatedNotification";
import { handleTaskUpdatedNotification } from "@/features/notification/handlers/handleTaskUpdatedNotification";
import { handleCreateProjectNotification } from "@/features/notification/handlers/handleCreateProjectNotification";
import { handleProjectMembersAddedNotification } from "@/features/notification/handlers/handleProjectMembersAddedNotification";
import { handleCommentReplyNotification } from "@/features/notification/handlers/handleCommentReplyNotification";
import { handleChangeUserRoleNotification } from "@/features/notification/handlers/handleChangeUserRoleNotification";
import { handleEmailChangedNotification } from "@/features/notification/handlers/handleEmailChangedNotification";
import { handlePasswordChangedNotification } from "@/features/notification/handlers/handlePasswordChangedNotification";
import { handleTaskDueSoonNotifications } from "@/features/notification/handlers/deadlines/handleTaskDueSoonNotifications";
import { handleTaskOverdueNotifications } from "@/features/notification/handlers/deadlines/handleTaskOverdueNotifications";
import { handleProjectDueSoonNotification } from "@/features/notification/handlers/deadlines/handleProjectDueSoonNotification";

const createJob = (name: string, data: Record<string, unknown>) =>
  ({
    name,
    data,
  }) as Job;

describe("notificationJobProcessor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ["task-assigned", handleTaskCreatedNotification],
    ["task-updated", handleTaskUpdatedNotification],
    ["project-assigned", handleCreateProjectNotification],
    ["project-members.assigned", handleProjectMembersAddedNotification],
    ["comment-reply", handleCommentReplyNotification],
    ["user-role.changed", handleChangeUserRoleNotification],
    ["user-email.changed", handleEmailChangedNotification],
    ["user-password.changed", handlePasswordChangedNotification],
    ["task-due-soon", handleTaskDueSoonNotifications],
    ["task-overdue", handleTaskOverdueNotifications],
    ["project-due-soon", handleProjectDueSoonNotification],
  ])("passes %s jobs to the matching handler", async (jobName, handler) => {
    const data = {
      workspaceId: "workspace-id",
      entityId: "entity-id",
    };

    await processNotificationJob(createJob(jobName, data));

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(data);
  });

  it("throws for unknown notification jobs", async () => {
    await expect(
      processNotificationJob(createJob("unknown-job", {})),
    ).rejects.toThrow("Unknown notification job: unknown-job");
  });
});
