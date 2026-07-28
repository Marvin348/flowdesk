import { Types } from "mongoose";
import type { TaskDocument } from "@/features/tasks/types/task.document";
import { createNotification } from "@/features/notification/services/createNotification.service";

type HandleTaskCreatedNotification = {
  actorId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  task: TaskDocument;
};
export const handleTaskCreatedNotification = async ({
  actorId,
  workspaceId,
  task,
}: HandleTaskCreatedNotification) => {
  const recipientIds = task.collaboratorIds.filter((id) => !id.equals(actorId));

  await Promise.all(
    recipientIds.map((recipientId) =>
      createNotification({
        workspaceId,
        actorId,
        recipientId,
        type: "task_assigned",
        entityType: "task",
        entityId: task._id,
        projectId: task.projectId,
      }),
    ),
  );
};
