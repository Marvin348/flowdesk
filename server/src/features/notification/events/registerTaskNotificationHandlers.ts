import { eventBus } from "@/shared/events/eventBus";
import {
  type TaskUpdateEvent,
  type TaskCreatedEvent,
} from "@/features/tasks/events/taskEvents";
import { createNotification } from "@/features/notification/services/createNotification.service";
import { handleTaskUpdatedNotification } from "@/features/notification/handlers/handleTaskUpdatedNotification";
import {
  ProjectCreatedEvent,
  ProjectMembersAddedEvent,
} from "@/features/projects/events/projectEvent";
import { handleCreateProjectNotification } from "@/features/notification/handlers/handleCreateProjectNotification";
import { handleProjectMembersAddedNotification } from "@/features/notification/handlers/handleProjectMembersAddedNotification";
import { ChangeUserRoleEvent } from "@/features/users/events/userEvents";
import { handleChangeUserRoleNotification } from "@/features/notification/handlers/handleChangeUserRoleNotification";

export const registerTaskNotificationHandlers = () => {
  eventBus.on<TaskCreatedEvent>("task.created", async ({ task, actorId }) => {
    const recipientIds = task.collaboratorIds.filter(
      (id) => !id.equals(actorId),
    );

    await Promise.all(
      recipientIds.map((recipientId) =>
        createNotification({
          workspaceId: task.workspaceId,
          actorId,
          recipientId,
          type: "task_assigned",
          entityType: "task",
          entityId: task._id,
          projectId: task.projectId,
        }),
      ),
    );
  });

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
};
