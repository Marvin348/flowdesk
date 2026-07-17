import { ProjectSummaryQueryParams } from "@/features/projects/validation/projectSummary.validator";
import { Types } from "mongoose";

type BuildProjectSummaryQueryInput = {
  workspaceId: Types.ObjectId;
  query: ProjectSummaryQueryParams;
};
export const buildProjectSummaryQuery = ({
  workspaceId,
  query,
}: BuildProjectSummaryQueryInput) => {
  const { search, priority, status } = query;

  return {
    workspaceId,
    ...(priority && { priority }),
    ...(status && { projectStatus: status }),
    ...(search && {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
        { projectStatus: { $regex: search, $options: "i" } },
      ],
    }),
  };
};
