import { Types, PipelineStage } from "mongoose";
import { ProjectTasksQuery } from "@/features/projects/validation/projectTasksSchema.validator";

type BuildProjectTasksPipelineInput = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  query: ProjectTasksQuery;
};

export const buildProjectTasksPipeline = ({
  workspaceId,
  projectId,
  query,
}: BuildProjectTasksPipelineInput): PipelineStage[] => {
  const { taskStatus, limit, offset } = query;

  return [
    {
      $match: {
        projectId,
        workspaceId,
        taskStatus,
      },
    },
    {
      $sort: {
        dueDate: 1,
        _id: 1,
      },
    },
    {
      $skip: offset,
    },
    {
      $limit: limit,
    },
    {
      $project: {
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
      },
    },

    {
      $group: {
        _id: null,
        tasks: { $push: "$$ROOT" },
        collaboratorIdArrays: { $push: "$collaboratorIds" },
      },
    },

    {
      $set: {
        taskCollaboratorIds: {
          $reduce: {
            input: "$collaboratorIdArrays",
            initialValue: [],
            in: {
              $setUnion: ["$$value", "$$this"],
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
        tasks: 1,
        _id: 0,
        collaborators: 1,
      },
    },
  ];
};
