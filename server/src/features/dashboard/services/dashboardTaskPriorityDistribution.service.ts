import { mapTaskPriorityItems } from "@/features/dashboard/mappers/mapTaskPriorityDistribution.js";
import { getProjects } from "@/features/projects/services/project.service.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { PRIORITY, type Priority } from "@shared/types/priority.js";
import { Types } from "mongoose";
import mongoose from "mongoose";

type TaskPriorityCount = {
  _id: Priority;
  count: number;
};

export const getTaskPriorityDistribution = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

  const projects = await getProjects({ workspaceId });
  const projectIds = projects.map((project) => new Types.ObjectId(project.id));

  const priorityCounts = await TaskModel.aggregate<TaskPriorityCount>([
    {
      $match: {
        workspaceId: workspaceObjectId,
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
