import { buildAttachmentQuery } from "@/features/attachments/queries/buildAttachmentQuery.js";
import { Types, PipelineStage } from "mongoose";

type BuildProjectAttachmentsPipelineInput = {
  workspaceId: Types.ObjectId;
  search: string;
  projectId: Types.ObjectId;
  page: number;
  limit: number;
};

export const buildProjectAttachmentsPipeline = ({
  workspaceId,
  search,
  projectId,
  page,
  limit,
}: BuildProjectAttachmentsPipelineInput): PipelineStage[] => {
  const matchStage = buildAttachmentQuery({ projectId, workspaceId, search });

  const skip = (page - 1) * limit;

  return [
    { $match: matchStage },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },

          {
            $lookup: {
              from: "users",
              let: { userId: "$userId" },
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
                    email: 1,
                    avatarKey: 1,
                    avatarStorageKey: 1,
                  },
                },
              ],
              as: "uploadedBy",
            },
          },
          {
            $unwind: "$uploadedBy",
          },
          {
            $lookup: {
              from: "tasks",
              let: { taskId: "$taskId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$taskId"] },
                        { $eq: ["$workspaceId", workspaceId] },
                        { $eq: ["$projectId", projectId] },
                      ],
                    },
                  },
                },
                {
                  $project: { _id: 1, title: 1 },
                },
              ],
              as: "task",
            },
          },
          {
            $unwind: {
              path: "$task",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              projectId: 1,
              taskId: 1,
              userId: 1,
              fileName: 1,
              fileUrl: 1,
              mimeType: 1,
              fileSize: 1,
              createdAt: 1,

              uploadedBy: 1,

              task: 1,
            },
          },
        ],
        metaData: [{ $count: "totalItems" }],
      },
    },
  ];
};
