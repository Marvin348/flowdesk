import { Types, PipelineStage } from "mongoose";
import { ProjectSummaryQueryParams } from "@/features/projects/validation/projectSummary.validator.js";
import { buildProjectSummaryQuery } from "@/features/projects/queries/projectSummaryQuery.js";

type BuildProjectSummaryPipelineInput = {
  workspaceId: Types.ObjectId;
  query: ProjectSummaryQueryParams;
};

export const buildProjectSummaryPipeline = ({
  workspaceId,
  query,
}: BuildProjectSummaryPipelineInput): PipelineStage[] => {
  const { page, limit, hasAttachments } = query;

  const matchStage = buildProjectSummaryQuery({ workspaceId, query });
  const skip = (page - 1) * limit;

  const hasAttachmentsMatch =
    hasAttachments === true
      ? { attachmentCount: { $gt: 0 } }
      : hasAttachments === false
        ? { attachmentCount: 0 }
        : null;

  return [
    { $match: matchStage },

    {
      $lookup: {
        from: "attachments",
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
          { $count: "count" },
        ],
        as: "attachmentStats",
      },
    },

    {
      $addFields: {
        attachmentCount: {
          $ifNull: [{ $first: "$attachmentStats.count" }, 0],
        },
      },
    },

    ...(hasAttachmentsMatch ? [{ $match: hasAttachmentsMatch }] : []),

    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },

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
                    inProgressTasks: {
                      $sum: {
                        $cond: [{ $eq: ["$taskStatus", "in_progress"] }, 1, 0],
                      },
                    },
                    pendingTasks: {
                      $sum: {
                        $cond: [{ $eq: ["$taskStatus", "pending"] }, 1, 0],
                      },
                    },
                    taskIds: { $addToSet: "$_id" },
                  },
                },
              ],
              as: "taskStats",
            },
          },
          {
            $addFields: {
              taskIds: {
                $ifNull: [{ $first: "$taskStats.taskIds" }, []],
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
                  $count: "count",
                },
              ],
              as: "commentStats",
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
              commentCount: {
                $ifNull: [{ $first: "$commentStats.count" }, 0],
              },
              userCount: {
                $size: {
                  $ifNull: ["$invitedUserIds", []],
                },
              },
            },
          },
          {
            $addFields: {
              userCount: {
                $size: {
                  $ifNull: ["$invitedUserIds", []],
                },
              },
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
                        {
                          $in: ["$_id", { $ifNull: ["$$invitedUserIds", []] }],
                        },
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

              invitedUsers: 1,
              userCount: 1,
              totalTasks: 1,
              doneTasks: 1,
              commentCount: 1,
              attachmentCount: 1,
            },
          },
        ],
        metaData: [{ $count: "totalItems" }],
      },
    },
  ];
};
