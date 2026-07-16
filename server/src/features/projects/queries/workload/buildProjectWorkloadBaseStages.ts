import { Types } from "mongoose";

type BuildProjectWorkloadBaseStagesInput = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
};

export const buildProjectWorkloadBaseStages = ({
  workspaceId,
  projectId,
}: BuildProjectWorkloadBaseStagesInput) => [
  {
    $match: {
      workspaceId,
      projectId,
    },
  },
  {
    $unwind: "$collaboratorIds",
  },
  {
    $group: {
      _id: "$collaboratorIds",
      totalTasks: { $sum: 1 },
      pendingTasks: {
        $sum: {
          $cond: [{ $eq: ["$taskStatus", "pending"] }, 1, 0],
        },
      },
      inProgressTasks: {
        $sum: {
          $cond: [{ $eq: ["$taskStatus", "in_progress"] }, 1, 0],
        },
      },
      doneTasks: {
        $sum: {
          $cond: [{ $eq: ["$taskStatus", "done"] }, 1, 0],
        },
      },
    },
  },
  {
    $addFields: {
      openTasks: {
        $add: ["$pendingTasks", "$inProgressTasks"],
      },
      progressPercent: {
        $cond: [
          { $eq: ["$totalTasks", 0] },
          0,
          {
            $round: [
              {
                $multiply: [{ $divide: ["$doneTasks", "$totalTasks"] }, 100],
              },
              0,
            ],
          },
        ],
      },
    },
  },
  {
    $lookup: {
      from: "users",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$_id", "$$userId"] },
                { $eq: ["$workspaceId", workspaceId] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            jobTitle: 1,
            avatarKey: 1,
            avatarStorageKey: 1,
          },
        },
      ],
      as: "user",
    },
  },
  {
    $unwind: "$user",
  },
];
