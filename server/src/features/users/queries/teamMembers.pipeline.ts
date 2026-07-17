import { buildTeamMembersSortStage } from "@/features/users/queries/teamMembersSort.query";
import { buildTeamMembersMatchStage } from "@/features/users/queries/teamMembers.query";
import { TeamMembersQueryParams } from "@/features/users/validators/teamMembersQuerySchema.validator";
import { Types } from "mongoose";
import { buildTeamMembersStatsMatchStage } from "@/features/users/queries/teamMembersStatsMatchStage.query";

type buildTeamMembersPipelineInput = {
  workspaceId: Types.ObjectId;
  query: TeamMembersQueryParams;
};

export const buildTeamMembersPipeline = ({
  workspaceId,
  query,
}: buildTeamMembersPipelineInput) => {
  const { search, role, sort, activity, progress, page, limit } = query;

  const matchStage = buildTeamMembersMatchStage({
    search,
    role,
    workspaceId,
  });

  const statsMatchStage = buildTeamMembersStatsMatchStage({
    activity,
    progress,
  });

  const sortStage = buildTeamMembersSortStage(sort);
  const skip = (page - 1) * limit;

  return [
    { $match: matchStage },
    {
      $lookup: {
        from: "tasks",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $in: ["$$userId", { $ifNull: ["$collaboratorIds", []] }],
                  },
                  { $eq: ["$workspaceId", workspaceId] },
                ],
              },
            },
          },
        ],
        as: "tasks",
      },
    },
    {
      $addFields: {
        tasksCount: { $size: "$tasks" },

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
        openTasks: {
          $subtract: ["$tasksCount", "$completedCount"],
        },

        progressPercent: {
          // tasksCount === 0 ? 0 : Math.round((completedCount / tasksCount) * 100)
          $cond: [
            { $eq: ["$tasksCount", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ["$completedCount", "$tasksCount"],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
          ],
        },
      },
    },

    { $match: statsMatchStage },

    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        jobTitle: 1,
        avatarKey: 1,
        avatarStorageKey: 1,

        tasksCount: 1,
        completedCount: 1,
        openTasks: 1,
        progressPercent: 1,
      },
    },
    { $sort: sortStage },

    {
      $facet: {
        data: [{ $sort: sortStage }, { $skip: skip }, { $limit: limit }],
        metadata: [{ $count: "totalItems" }],
      },
    },
  ];
};
