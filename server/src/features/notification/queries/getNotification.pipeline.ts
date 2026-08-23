import { Types } from "mongoose";
import type { PipelineStage } from "mongoose";
import { NotificationQuery } from "@/features/notification/validators/notification.validator";
import { NOTIFICATION_FILTER_MAP } from "@/features/notification/constants/notificationSettingByType";

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
  const { page, limit, status, view, filterType } = query;

  const skip = (page - 1) * limit;

  const viewMatch: PipelineStage.Match["$match"] =
    view === "archive" ? { archivedAt: { $ne: null } } : { archivedAt: null };

  const filterTypeMatch: PipelineStage.Match["$match"] = filterType
    ? { type: { $in: NOTIFICATION_FILTER_MAP[filterType] } }
    : {};

  const sortStage: PipelineStage.Sort =
    view === "archive"
      ? { $sort: { createdAt: -1 } }
      : { $sort: { pinnedAt: -1, createdAt: -1 } };

  return [
    {
      $match: { workspaceId, recipientId },
    },
    {
      $facet: {
        data: [
          { $match: { ...viewMatch, ...filterTypeMatch } },
          ...(status === "unread" ? [{ $match: { isRead: false } }] : []),
          sortStage,
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
              pinnedAt: 1,
              archivedAt: 1,
              createdAt: 1,

              taskEntity: 1,
              projectEntity: 1,
              actor: 1,
            },
          },
        ],
        metaData: [
          { $match: { ...viewMatch, ...filterTypeMatch } },
          ...(status === "unread" ? [{ $match: { isRead: false } }] : []),
          { $count: "totalItems" },
        ],

        unreadMetaData: [
          { $match: { ...viewMatch, ...filterTypeMatch } },
          { $match: { isRead: false } },
          { $count: "unreadCount" },
        ],

        inboxCount: [
          {
            $match: { archivedAt: null },
          },
          {
            $count: "count",
          },
        ],
        archiveCount: [
          {
            $match: { archivedAt: { $ne: null } },
          },
          {
            $count: "count",
          },
        ],
      },
    },
  ];
};
