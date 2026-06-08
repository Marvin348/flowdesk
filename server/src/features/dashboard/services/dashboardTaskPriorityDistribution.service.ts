import { mapTaskPriorityItems } from "@/features/dashboard/mappers/mapTaskPriorityDistribution.js";
import { getProjects } from "@/features/projects/services/project.service.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { PRIORITY, type Priority } from "@shared/types/priority.js";
import { Types } from "mongoose";

type TaskPriorityCount = {
  _id: Priority;
  count: number;
};

export const getTaskPriorityDistribution = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) => {
  const projects = await getProjects({ userId, workspaceId });
  const projectIds = projects.map((project) => project.id);

  const priorityCounts = await TaskModel.aggregate<TaskPriorityCount>([
    {
      $match: {
        workspaceId: new Types.ObjectId(workspaceId),
        projectId: { $in: projectIds },
      },
    },
    {
      $group: {
        _id: "$taskPriority",
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = Object.fromEntries(
    PRIORITY.map((priority) => [priority, 0]),
  ) as Record<Priority, number>;

  priorityCounts.forEach((item) => {
    counts[item._id] = item.count;
  });

  return mapTaskPriorityItems(counts);
};
