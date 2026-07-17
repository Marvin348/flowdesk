import { Types, PipelineStage } from "mongoose";
import { ProjectWorkloadQuery } from "@/features/projects/validation/projectWorkloadSchema.validator";
import { buildProjectWorkloadSort } from "@/features/projects/queries/workload/projectWorkloadSort";
import { buildProjectWorkloadBaseStages } from "@/features/projects/queries/workload/buildProjectWorkloadBaseStages";

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
    ...buildProjectWorkloadBaseStages({ workspaceId, projectId }),

    {
      $facet: {
        data: [{ $sort: sortStage }, { $skip: skip }, { $limit: limit }],
        metaData: [{ $count: "totalItems" }],
      },
    },
  ];
};
