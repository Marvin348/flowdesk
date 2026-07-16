import { Types, PipelineStage } from "mongoose";

type BuildProjectTasksPipelineInput = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
};

export const buildProjectTasksPipeline = ({
  workspaceId,
  projectId,
}: BuildProjectTasksPipelineInput): PipelineStage[] => {
  return [
    {
      $match: { workspaceId, projectId },
    },

    {
      $project: {
        _id: 1,
        projectId: 1,
        title: 1,
        dueDate: 1,
        taskStatus: 1,
        taskPriority: 1,
        description: 1,
        collaboratorIds: 1,
        tags: 1,
        reminderAt: 1,
        completedAt: 1,
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
      $addFields: {
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
        collaborators: 1,
      },
    },
  ];
};
