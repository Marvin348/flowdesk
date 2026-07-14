import { Types, PipelineStage } from "mongoose";

type BuildProjectOverviewPipelineInput = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
};

export const buildProjectOverviewPipeline = ({
  workspaceId,
  projectId,
}: BuildProjectOverviewPipelineInput): PipelineStage[] => {
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
            $project: {
              _id: 1,
              title: 1,
              dueDate: 1,
              taskStatus: 1,
              description: 1,
              collaboratorIds: 1,
            },
          },
        ],
        as: "tasks",
      },
    },

    {
      $addFields: {
        totalTasks: {
          $size: { $ifNull: ["$tasks", []] },
        },
      },
    },

    {
      $addFields: {
        doneTasks: {
          $size: {
            $filter: {
              input: { $ifNull: ["$tasks", []] },
              as: "task",
              cond: {
                $eq: ["$$task.taskStatus", "done"],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        taskIds: {
          $map: {
            input: "$tasks",
            as: "task",
            in: "$$task._id",
          },
        },
      },
    },

    {
      $addFields: {
        openTasks: {
          $slice: [
            {
              $filter: {
                input: { $ifNull: ["$tasks", []] },
                as: "task",
                cond: {
                  $in: ["$$task.taskStatus", ["pending", "in_progress"]],
                },
              },
            },
            5,
          ],
        },
      },
    },

    {
      $lookup: {
        from: "comments",
        let: { taskIds: "$taskIds" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$taskId", "$$taskIds"] },
                  { $eq: ["$workspaceId", workspaceId] },
                ],
              },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 6,
          },
          {
            $project: {
              _id: 1,
              userId: 1,
              message: 1,
              createdAt: 1,
            },
          },
        ],
        as: "comments",
      },
    },

    {
      $lookup: {
        from: "users",
        let: { invitedUserIds: "$invitedUserIds" },
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
              name: 1,
              avatarKey: 1,
              avatarStorageKey: 1,
              jobTitle: 1,
            },
          },
        ],
        as: "invitedUsers",
      },
    },
    {
      $project: {
        _id: 1,
        invitedUsers: 1,

        openTasks: 1,
        comments: 1,

        totalTasks: 1,
        doneTasks: 1,
      },
    },
  ];
};
