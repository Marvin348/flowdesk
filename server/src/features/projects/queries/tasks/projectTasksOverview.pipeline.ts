import { PROJECT_TASKS_LIMIT } from "@shared/constants/pagination";
import { Types, PipelineStage } from "mongoose";

type BuildProjectTasksPipelineInput = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
};

export const buildProjectTasksOverviewPipeline = ({
  workspaceId,
  projectId,
}: BuildProjectTasksPipelineInput): PipelineStage[] => {
  const projectTaskFields = {
    _id: 1,
    title: 1,
    projectId: 1,
    taskStatus: 1,
    taskPriority: 1,
    tags: 1,
    collaboratorIds: 1,
    dueDate: 1,
    createdAt: 1,
    updatedAt: 1,
  } satisfies Record<string, 0 | 1>;

  return [
    {
      $match: {
        projectId,
        workspaceId,
      },
    },
    {
      $facet: {
        pendingTasks: [
          { $match: { workspaceId, projectId, taskStatus: "pending" } },
          { $sort: { dueDate: 1, _id: 1 } },
          { $limit: PROJECT_TASKS_LIMIT },
          { $project: projectTaskFields },
        ],

        inProgressTasks: [
          { $match: { workspaceId, projectId, taskStatus: "in_progress" } },
          { $sort: { dueDate: 1, _id: 1 } },
          { $limit: PROJECT_TASKS_LIMIT },
          { $project: projectTaskFields },
        ],

        doneTasks: [
          { $match: { workspaceId, projectId, taskStatus: "done" } },
          { $sort: { dueDate: 1, _id: 1 } },
          { $limit: PROJECT_TASKS_LIMIT },
          { $project: projectTaskFields },
        ],

        totals: [
          {
            $group: {
              _id: "$taskStatus",
              total: { $sum: 1 },
            },
          },
        ],
      },
    },

    {
      $set: {
        allLoadedTasks: {
          $concatArrays: ["$pendingTasks", "$inProgressTasks", "$doneTasks"],
        },
      },
    },

    {
      $set: {
        taskCollaboratorIds: {
          $reduce: {
            input: "$allLoadedTasks",
            initialValue: [],
            in: {
              $setUnion: [
                "$$value",
                { $ifNull: ["$$this.collaboratorIds", []] },
              ],
            },
          },
        },
      },
    },

    {
      $lookup: {
        from: "users",
        let: { collaboratorIds: "$taskCollaboratorIds" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$collaboratorIds"] },
                  { $eq: ["$workspaceId", workspaceId] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              avatarKey: 1,
              avatarStorageKey: 1,
            },
          },
        ],
        as: "collaborators",
      },
    },

    {
      $project: {
        pendingTasks: 1,
        inProgressTasks: 1,
        doneTasks: 1,

        totals: 1,
        collaborators: 1,
      },
    },
  ];
};
