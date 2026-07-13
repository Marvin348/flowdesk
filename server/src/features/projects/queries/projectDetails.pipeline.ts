import { Types, PipelineStage } from "mongoose";

type BuildProjectDetailsPipeline = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
};

export const buildProjectDetailsPipeline = ({
  workspaceId,
  projectId,
}: BuildProjectDetailsPipeline): PipelineStage[] => {
  return [
    {
      $match: { _id: projectId, workspaceId },
    },
    {
      $lookup: {
        from: "tasks",
        let: { projectId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$projectId", "$$projectId"] },
                  { $eq: ["$workspaceId", workspaceId] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              totalTasks: { $sum: 1 },
              doneTasks: {
                $sum: {
                  $cond: [{ $eq: ["$taskStatus", "done"] }, 1, 0],
                },
              },
            },
          },
        ],
        as: "taskStats",
      },
    },
    {
      $addFields: {
        totalTasks: {
          $ifNull: [{ $first: "$taskStats.totalTasks" }, 0],
        },
        doneTasks: {
          $ifNull: [{ $first: "$taskStats.doneTasks" }, 0],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        let: {
          invitedUserIds: "$invitedUserIds",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$invitedUserIds"] },
                  { $eq: ["$workspaceId", workspaceId] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              avatarKey: 1,
              avatarStorageKey: 1,
            },
          },
        ],
        as: "invitedUsers",
      },
    },
    {
      $project: {
        _id: 1,
        workspaceId: 1,
        title: 1,
        description: 1,
        ownerId: 1,
        priority: 1,
        projectStatus: 1,
        dueDate: 1,
        invitedUserIds: 1,
        createdAt: 1,
        updatedAt: 1,

        totalTasks: 1,
        doneTasks: 1,

        invitedUsers: 1,
      },
    },
  ];
};
