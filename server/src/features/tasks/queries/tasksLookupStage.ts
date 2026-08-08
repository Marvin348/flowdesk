import { Types, PipelineStage } from "mongoose";

export const buildTasksLookupStage = ({
  workspaceId,
}: {
  workspaceId: Types.ObjectId;
}): PipelineStage[] => [
  {
    $lookup: {
      from: "tasks",
      let: { projectId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$projectId", "$$projectId"] },
                { $eq: ["$workspaceId", workspaceId] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            taskStatus: 1,
            dueDate: 1,
          },
        },
      ],
      as: "tasks",
    },
  },
];
