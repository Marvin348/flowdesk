import { Types, PipelineStage } from "mongoose";
import { buildProjectLookupStages } from "@/features/projects/queries/projectLookupStage";

type BuildDashboardUrgentTasksPipelineInput = {
  workspaceId: Types.ObjectId;
  endOfWeek: Date;
  startOfToday: Date;
  limit: number;
};

export const buildDashboardUrgentTasksPipeline = ({
  workspaceId,
  endOfWeek,
  startOfToday,
  limit,
}: BuildDashboardUrgentTasksPipelineInput): PipelineStage[] => {
  return [
    {
      $match: {
        workspaceId,
        taskStatus: { $in: ["pending", "in_progress"] },
        dueDate: { $lte: endOfWeek },
      },
    },
    {
      $facet: {
        dueThisWeekItems: [
          {
            $match: {
              dueDate: {
                $gte: startOfToday,
                $lte: endOfWeek,
              },
            },
          },
          {
            $sort: {
              dueDate: 1,
              _id: 1,
            },
          },
          { $limit: limit },
          ...buildProjectLookupStages({ workspaceId }),

          {
            $project: {
              _id: 1,
              title: 1,
              taskStatus: 1,
              taskPriority: 1,
              dueDate: 1,
              project: {
                _id: 1,
                title: 1,
              },
            },
          },
        ],

        dueThisWeekTotal: [
          {
            $match: {
              dueDate: {
                $gte: startOfToday,
                $lte: endOfWeek,
              },
            },
          },
          {
            $count: "count",
          },
        ],

        overdueItems: [
          {
            $match: {
              dueDate: {
                $lt: startOfToday,
              },
            },
          },
          {
            $sort: {
              dueDate: 1,
              _id: 1,
            },
          },
          { $limit: limit },
          ...buildProjectLookupStages({ workspaceId }),

          {
            $project: {
              _id: 1,
              title: 1,
              taskStatus: 1,
              taskPriority: 1,
              dueDate: 1,
              project: {
                _id: 1,
                title: 1,
              },
            },
          },
        ],

        overdueTotal: [
          {
            $match: {
              dueDate: { $lt: startOfToday },
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },

    {
      $project: {
        dueThisWeekItems: 1,
        overdueItems: 1,

        dueThisWeekTotal: {
          $ifNull: [
            {
              $arrayElemAt: ["$dueThisWeekTotal.count", 0],
            },
            0,
          ],
        },

        overdueTotal: {
          $ifNull: [
            {
              $arrayElemAt: ["$overdueTotal.count", 0],
            },
            0,
          ],
        },
      },
    },
  ];
};
