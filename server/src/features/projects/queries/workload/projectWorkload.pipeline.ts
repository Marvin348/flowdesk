import { Types, PipelineStage } from "mongoose";
import { ProjectWorkloadQuery } from "@/features/projects/validation/projectWorkloadSchema.validator.js";
import { buildProjectWorkloadSort } from "@/features/projects/queries/workload/projectWorkloadSort.js";

type BuildProjectCommentsPipelineInput = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  query: ProjectWorkloadQuery;
};

export const buildProjectWorkloadPipeline = ({
  workspaceId,
  projectId,
  query,
}: BuildProjectCommentsPipelineInput): PipelineStage[] => {
  const { page, limit, workloadSort } = query;

  const sortStage = buildProjectWorkloadSort(workloadSort);
  const skip = (page - 1) * limit;

  return [
    {
      $match: { projectId, workspaceId },
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
              avatarKey: 1,
              avatarStorageKey: 1,
              jobTitle: 1,
            },
          },
        ],
        as: "user",
      },
    },

    {
      $unwind: "$user",
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
      $facet: {
        data: [{ $sort: sortStage }, { $skip: skip }, { $limit: limit }],
        metaData: [{ $count: "totalItems" }],
      },
    },
  ];
};
