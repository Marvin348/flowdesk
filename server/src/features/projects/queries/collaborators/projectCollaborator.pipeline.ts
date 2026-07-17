import { Types, PipelineStage } from "mongoose";
import { ProjectCollaboratorQuery } from "@/features/projects/validation/projectCollaboratorSchema.validator";
import { buildProjectCollaboratorSort } from "@/features/projects/queries/collaborators/projectCollaboratorsSort";

type BuildProjectCollaboratorPipelineInput = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  query: ProjectCollaboratorQuery;
};

export const buildProjectCollaboratorPipeline = ({
  workspaceId,
  projectId,
  query,
}: BuildProjectCollaboratorPipelineInput): PipelineStage[] => {
  const { page, limit, collaboratorsSort } = query;

  const sortStage = buildProjectCollaboratorSort(collaboratorsSort);

  const skip = (page - 1) * limit;

  return [
    {
      $match: {
        workspaceId,
        _id: projectId,
      },
    },
    {
      $lookup: {
        from: "users",
        let: {
          invitedUserIds: "$invitedUserIds",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $in: ["$_id", "$$invitedUserIds"],
                  },
                  {
                    $eq: ["$workspaceId", workspaceId],
                  },
                ],
              },
            },
          },
          {
            $facet: {
              data: [
                { $sort: sortStage },
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    jobTitle: 1,
                    role: 1,
                    avatarKey: 1,
                    avatarStorageKey: 1,
                  },
                },
              ],
              metaData: [{ $count: "totalItems" }],
            },
          },
        ],
        as: "users",
      },
    },

    {
      $addFields: {
        usersFacet: { $arrayElemAt: ["$users", 0] },
      },
    },

    {
      $addFields: {
        collaborators: {
          $ifNull: ["$usersFacet.data", []],
        },
        totalItems: {
          $ifNull: [
            { $arrayElemAt: ["$usersFacet.metaData.totalItems", 0] },
            0,
          ],
        },
      },
    },
    {
      $project: {
        collaborators: 1,
        totalItems: 1,
      },
    },
  ];
};
