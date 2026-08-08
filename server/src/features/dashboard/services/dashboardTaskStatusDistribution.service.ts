import { mapTaskStatusDistribution } from "@/features/dashboard/mappers/mapTaskStatusDistribution";
import { TaskModel } from "@/features/tasks/models/task.model";
import { STATUSBASE, type StatusBase } from "@shared/types/StatusBase";
import { Types } from "mongoose";

type TaskStatusCount = {
  _id: StatusBase;
  count: number;
};

export const getTaskStatusDistribution = async ({
  workspaceId,
}: {
  workspaceId: Types.ObjectId;
}) => {
  const statusCounts = await TaskModel.aggregate<TaskStatusCount>([
    {
      $match: {
        workspaceId,
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
