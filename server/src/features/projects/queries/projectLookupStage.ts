import { Types, PipelineStage, } from "mongoose";

export const buildProjectLookupStages = ({
  workspaceId,
}: {
  workspaceId: Types.ObjectId;
}): PipelineStage.FacetPipelineStage[] => [
  {
    $lookup: {
      from: "projects",
      let: { projectId: "$projectId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$_id", "$$projectId"] },
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
      as: "project",
    },
  },
  {
    $unwind: "$project",
  },
];
