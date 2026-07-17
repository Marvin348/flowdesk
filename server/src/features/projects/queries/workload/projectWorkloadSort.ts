import { PipelineStage } from "mongoose";
import { ProjectWorkloadQuery } from "../../validation/projectWorkloadSchema.validator";

export const buildProjectWorkloadSort = (
  sort: ProjectWorkloadQuery["workloadSort"],
): PipelineStage.Sort["$sort"] => {
  switch (sort) {
    case "totalTasks_asc":
      return { totalTasks: 1, _id: 1 };

    case "totalTasks_desc":
      return { totlTasks: -1, _id: 1 };

    case "openTasks_asc":
      return { openTasks: 1, _id: 1 };

    case "openTasks_desc":
      return { openTasks: -1, _id: 1 };

    case "progressStatus_asc":
      return { progressPercent: 1, _id: 1 };

    case "progressStatus_desc":
      return { progressPercent: -1, _id: 1 };

    case "name_asc":
      return { "user.name": 1, _id: 1 };

    case "name_desc":
      return { "user.name": -1, _id: 1 };

    default:
      return { "user.name": 1, _id: 1 };
  }
};
