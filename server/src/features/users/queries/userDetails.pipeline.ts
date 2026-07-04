import { Types, PipelineStage } from "mongoose";

type BuildUserDetailsPipelineInput = {
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
};

export const buildUserDetailsPipeline = ({
  workspaceId,
  userId,
}: BuildUserDetailsPipelineInput): PipelineStage[] => {
  return [
    {
      $match: {
        _id: userId,
        workspaceId,
      },
    },
    {
      $lookup: {
        from: "projects",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$workspaceId", workspaceId] },
                  { $in: ["$$userId", "$invitedUserIds"] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              priority: 1,
              projectStatus: 1,
            },
          },
        ],
        as: "invitedProjects",
      },
    },

    {
      $lookup: {
        from: "tasks",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$workspaceId", workspaceId] },
                  { $in: ["$$userId", "$collaboratorIds"] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              taskStatus: 1,
              dueDate: 1,
              completedAt: 1,
              taskPriority: 1,
              projectId: 1,
            },
          },
        ],
        as: "tasks",
      },
    },

    {
      $addFields: {
        pendingCount: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $eq: ["$$task.taskStatus", "pending"] },
            },
          },
        },

        inProgressCount: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $eq: ["$$task.taskStatus", "in_progress"] },
            },
          },
        },

        completedCount: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $eq: ["$$task.taskStatus", "done"] },
            },
          },
        },
      },
    },

    {
      $addFields: {
        recentCompletedTask: {
          $first: {
            $sortArray: {
              input: {
                $filter: {
                  input: "$tasks",
                  as: "task",
                  cond: {
                    $and: [
                      { $eq: ["$$task.taskStatus", "done"] },
                      { $ne: ["$$task.completedAt", null] },
                    ],
                  },
                },
              },
              sortBy: { completedAt: -1 },
            },
          },
        },

        nextDueTask: {
          $first: {
            $sortArray: {
              input: {
                $filter: {
                  input: "$tasks",
                  as: "task",
                  cond: {
                    $and: [
                      { $ne: ["$$task.taskStatus", "done"] },
                      { $ne: ["$$task.dueDate", null] },
                    ],
                  },
                },
              },
              sortBy: { dueDate: 1 },
            },
          },
        },
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        avatarKey: 1,
        avatarUrl: 1,
        jobTitle: 1,
        role: 1,

        invitedProjects: 1,

        pendingCount: 1,
        inProgressCount: 1,
        completedCount: 1,

        recentCompletedTask: 1,
        nextDueTask: 1,
      },
    },
  ];
};
