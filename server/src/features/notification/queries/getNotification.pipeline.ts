import { Types, PipelineStage } from "mongoose";
import { NotificationQuery } from "../validators/notification.validator";

type getNotificationPipelineInput = {
  workspaceId: Types.ObjectId;
  recipientId: Types.ObjectId;
  query: NotificationQuery;
};

export const getNotificationPipeline = ({
  workspaceId,
  recipientId,
  query,
}: getNotificationPipelineInput): PipelineStage[] => {
  const { page, limit, status } = query;

  const skip = (page - 1) * limit;

  return [
    {
      $match: { workspaceId, recipientId },
    },
    {
      $facet: {
        data: [
          ...(status === "unread" ? [{ $match: { isRead: false } }] : []),
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },

          {
            $lookup: {
              from: "tasks",
              let: {
                entityType: "$entityType",
                entityId: "$entityId",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$$entityType", "task"] },
                        { $eq: ["$_id", "$$entityId"] },
                        { $eq: ["$workspaceId", workspaceId] },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    projectId: 1,
                  },
                },
              ],
              as: "taskEntity",
            },
          },
          {
            $unwind: {
              path: "$taskEntity",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "projects",
              let: {
                entityType: "$entityType",
                entityId: "$entityId",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$$entityType", "project"] },
                        { $eq: ["$_id", "$$entityId"] },
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
              as: "projectEntity",
            },
          },
          {
            $unwind: {
              path: "$projectEntity",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "users",
              let: {
                actorId: "$actorId",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$actorId"] },
                        { $eq: ["$workspaceId", workspaceId] },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                  },
                },
              ],
              as: "actor",
            },
          },
          {
            $unwind: {
              path: "$actor",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              _id: 1,
              type: 1,
              entityType: 1,
              metadata: 1,
              isRead: 1,
              readAt: 1,
              createdAt: 1,

              taskEntity: 1,
              projectEntity: 1,
              actor: 1,
            },
          },
        ],
        metaData: [
          ...(status === "unread" ? [{ $match: { isRead: false } }] : []),
          { $count: "totalItems" },
        ],

        unreadMetaData: [
          { $match: { isRead: false } },
          { $count: "unreadCount" },
        ],
      },
    },
  ];
};
