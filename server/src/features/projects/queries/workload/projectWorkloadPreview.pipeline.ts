import { Types, PipelineStage } from "mongoose";
import { buildProjectWorkloadBaseStages } from "@/features/projects/queries/workload/buildProjectWorkloadBaseStages.js";

type BuildProjectWorkloadPreviewPipelineInput = {
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  limit: number;
};

export const buildProjectWorkloadPreviewPipeline = ({
  workspaceId,
  projectId,
  limit,
}: BuildProjectWorkloadPreviewPipelineInput): PipelineStage[] => [
  ...buildProjectWorkloadBaseStages({ workspaceId, projectId }),

  {
    $sort: {
      openTasks: -1,
      _id: 1,
    },
  },
  {
    $limit: limit,
  },
];
