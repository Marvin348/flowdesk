import { ProjectCommentsQuery } from "@/features/projects/validation/projectCommentsSchema.validator";
import { PipelineStage } from "mongoose";

export const buildProjectCommentsSort = (
  sort: ProjectCommentsQuery["commentsSort"],
): PipelineStage.Sort["$sort"] => {
  switch (sort) {
    case "newest":
      return { createdAt: -1, _id: 1 };

    case "oldest":
      return { createdAt: 1, _id: 1 };

    default:
      return { createdAt: -1, _id: 1 };
  }
};
