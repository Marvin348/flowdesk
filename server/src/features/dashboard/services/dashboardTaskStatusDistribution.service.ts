import { mapTaskStatusDistribution } from "@/features/dashboard/mappers/mapTaskStatusDistribution.js";
import { getProjects } from "@/features/projects/services/project.service.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { STATUSBASE, type StatusBase } from "@shared/types/StatusBase.js";
import { Types } from "mongoose";

type TaskStatusCount = {
  _id: StatusBase;
  count: number;
};

export const getTaskStatusDistribution = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const projects = await getProjects({ workspaceId });
  const projectIds = projects.map((project) => project.id);

  const statusCounts = await TaskModel.aggregate<TaskStatusCount>([
    {
      $match: {
        workspaceId: new Types.ObjectId(workspaceId),
        projectId: { $in: projectIds },
      },
    },
    {
      $group: {
        _id: "$taskStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = Object.fromEntries(
    STATUSBASE.map((status) => [status, 0]),
  ) as Record<StatusBase, number>;

  statusCounts.forEach((item) => {
    counts[item._id] = item.count;
  });

  return mapTaskStatusDistribution(counts);
};
