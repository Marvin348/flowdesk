import { Types, PipelineStage } from "mongoose";
import type { ProjectCommentsQuery } from "@/features/projects/validation/projectCommentsSchema.validator";
import { buildProjectCommentsSort } from "@/features/projects/queries/comments/projectCommentsSort";

type BuildProjectCommentsPipelineInput = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  query: ProjectCommentsQuery;
};

export const buildProjectCommentsPipeline = ({
  workspaceId,
  projectId,
  query,
}: BuildProjectCommentsPipelineInput): PipelineStage[] => {
  const { limit, commentsSort } = query;

  const sortStage = buildProjectCommentsSort(commentsSort);

  return [
    {
      $match: { workspaceId, _id: projectId },
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
            },
          },
        ],
        as: "tasks",
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
            $facet: {
              data: [
                { $sort: sortStage },
                { $limit: limit },
                {
                  $project: {
                    _id: 1,
                    taskId: 1,
                    userId: 1,
                    message: 1,
                    createdAt: 1,
                    parentCommentId: 1,
                  },
                },
              ],
              metaData: [{ $count: "totalItems" }],
            },
          },
        ],
        as: "allComments",
      },
    },

    {
      $addFields: {
        commentsFacet: { $arrayElemAt: ["$allComments", 0] },
      },
    },

    {
      $addFields: {
        comments: {
          $ifNull: ["$commentsFacet.data", []],
        },
        totalItems: {
          $ifNull: [
            { $arrayElemAt: ["$commentsFacet.metaData.totalItems", 0] },
            0,
          ],
        },
      },
    },

    {
      $addFields: {
        commentUserIds: {
          $setUnion: [
            {
              $map: {
                input: { $ifNull: ["$comments", []] },
                as: "comment",
                in: "$$comment.userId",
              },
            },
            [],
          ],
        },
      },
    },

    {
      $lookup: {
        from: "users",
        let: { commentUserIds: "$commentUserIds" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$commentUserIds"] },
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
        as: "users",
      },
    },
    {
      $project: {
        tasks: 1,
        comments: 1,
        users: 1,
        totalItems: 1,
      },
    },
  ];
};
