import { buildTaskMetricsStages } from "@/features/tasks/queries/taskMetricsStages";
import { buildTasksLookupStage } from "@/features/tasks/queries/tasksLookupStage";
import { Types, PipelineStage } from "mongoose";

type BuildDashboardAttentionRequiredPipelineInput = {
  workspaceId: Types.ObjectId;
  startOfToday: Date;
};
export const buildDashboardAttentionRequiredPipeline = ({
  workspaceId,
  startOfToday,
}: BuildDashboardAttentionRequiredPipelineInput): PipelineStage[] => {
  return [
    {
      $match: {
        workspaceId,
        projectStatus: { $in: ["pending", "in_progress"] },
      },
    },
    ...buildTasksLookupStage({ workspaceId }),

    ...buildTaskMetricsStages({ startOfToday }),

    {
      $addFields: {
        daysRemaining: {
          $dateDiff: {
            startDate: startOfToday,
            endDate: "$dueDate",
            unit: "day",
          },
        },
      },
    },

    {
      $facet: {
        mostOverdueProject: [
          {
            $match: {
              daysRemaining: { $lt: 0 },
            },
          },
          {
            $sort: {
              daysRemaining: 1,
            },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              _id: 1,
              title: 1,
              projectStatus: 1,
              dueDate: 1,
              daysRemaining: 1,
            },
          },
        ],

        lowProgressRisk: [
          {
            $match: {
              completionRate: {
                $lt: 25,
              },
              openTaskCount: {
                $gte: 5,
              },
              daysRemaining: {
                $gt: 7,
              },
            },
          },
          {
            $sort: {
              completionRate: 1,
              openTaskCount: -1,
              daysRemaining: 1,
            },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              _id: 1,
              title: 1,
              projectStatus: 1,
              completionRate: 1,
              openTaskCount: 1,
              daysRemaining: 1,
            },
          },
        ],

        deadlineRisk: [
          {
            $match: {
              daysRemaining: {
                $gte: 0,
                $lte: 7,
              },
              completionRate: {
                $lt: 50,
              },
            },
          },
          {
            $sort: {
              daysRemaining: 1,
              completionRate: 1,
            },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              _id: 1,
              title: 1,
              projectStatus: 1,
              dueDate: 1,
              daysRemaining: 1,
              completionRate: 1,
              openTaskCount: 1,
            },
          },
        ],
      },
    },

    {
      $project: {
        mostOverdueProject: {
          $ifNull: [{ $arrayElemAt: ["$mostOverdueProject", 0] }, null],
        },
        deadlineRisk: {
          $ifNull: [{ $arrayElemAt: ["$deadlineRisk", 0] }, null],
        },
        lowProgressRisk: {
          $ifNull: [{ $arrayElemAt: ["$lowProgressRisk", 0] }, null],
        },
      },
    },
  ];
};
