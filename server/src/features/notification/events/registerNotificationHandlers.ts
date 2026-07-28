import { eventBus } from "@/shared/events/eventBus";
import {
  type TaskUpdateEvent,
  type TaskCreatedEvent,
} from "@/features/tasks/events/taskEvents";
import { handleTaskUpdatedNotification } from "@/features/notification/handlers/handleTaskUpdatedNotification";
import {
  ProjectCreatedEvent,
  ProjectMembersAddedEvent,
} from "@/features/projects/events/projectEvent";
import { handleCreateProjectNotification } from "@/features/notification/handlers/handleCreateProjectNotification";
import { handleProjectMembersAddedNotification } from "@/features/notification/handlers/handleProjectMembersAddedNotification";
import {
  ChangeUserRoleEvent,
  EmailChangedEvent,
} from "@/features/users/events/userEvents";
import { handleChangeUserRoleNotification } from "@/features/notification/handlers/handleChangeUserRoleNotification";
import type { CommentReplyEvent } from "@/features/comments/events/commentEvents";
import { handleCommentReply } from "@/features/notification/handlers/handleCommentReply";
import type { PasswordChangedEvent } from "@/features/auth/events/authEvents";
import { handlePasswordChangedNotification } from "@/features/notification/handlers/handlePasswordChangedNotification";
import { handleEmailChangedNotification } from "@/features/notification/handlers/handleEmailChangedNotification";
import { handleTaskCreatedNotification } from "@/features/notification/handlers/handleTaskCreatedNotification";

export const registerNotificationHandlers = () => {
  eventBus.on<TaskCreatedEvent>(
    "task.created",
    async ({ task, actorId, workspaceId }) => {
      await handleTaskCreatedNotification({
        workspaceId,
        actorId,
        task,
      });
    },
  );

  eventBus.on<TaskUpdateEvent>(
    "task.updated",
    async ({
      actorId,
      workspaceId,
      taskId,
      projectId,
      previousCollaboratorIds,
      currentCollaboratorIds,
    }) => {
      await handleTaskUpdatedNotification({
        actorId,
        workspaceId,
        taskId,
        projectId,
        previousCollaboratorIds,
        currentCollaboratorIds,
      });
    },
  );

  eventBus.on<ProjectCreatedEvent>(
    "project.created",
    async ({ actorId, workspaceId, projectId, invitedUserIds }) => {
      await handleCreateProjectNotification({
        actorId,
        workspaceId,
        projectId,
        invitedUserIds,
      });
    },
  );

  eventBus.on<ProjectMembersAddedEvent>(
    "project.members_added",
    async ({ actorId, workspaceId, addedUserIds, projectId }) => {
      await handleProjectMembersAddedNotification({
        actorId,
        workspaceId,
        addedUserIds,
        projectId,
      });
    },
  );

  eventBus.on<ChangeUserRoleEvent>(
    "user.role_changed",
    async ({
      actorId,
      workspaceId,
      recipientId,
      previousRole,
      currentRole,
    }) => {
      await handleChangeUserRoleNotification({
        actorId,
        workspaceId,
        recipientId,
        previousRole,
        currentRole,
      });
    },
  );

  eventBus.on<CommentReplyEvent>(
    "comment.reply",
    async ({ workspaceId, actorId, recipientId, commentId, projectId }) => {
      await handleCommentReply({
        workspaceId,
        actorId,
        recipientId,
        commentId,
        projectId,
      });
    },
  );

  eventBus.on<PasswordChangedEvent>(
    "user.password_changed",
    async ({ workspaceId, recipientId }) => {
      await handlePasswordChangedNotification({ workspaceId, recipientId });
    },
  );

  eventBus.on<EmailChangedEvent>(
    "user.email_changed",
    async ({ workspaceId, recipientId }) => {
      await handleEmailChangedNotification({ workspaceId, recipientId });
    },
  );
};
