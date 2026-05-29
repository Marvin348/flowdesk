import { mapTaskPriorityItems } from "@/features/dashboard/mappers/mapTaskPriorityDistribution.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { PRIORITY, type Priority } from "@shared/types/priority.js";

type TaskPriorityCount = {
  _id: Priority;
  count: number;
};

export const getTaskPriorityDistribution = async () => {
  const priorityCounts = await TaskModel.aggregate<TaskPriorityCount>([
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
