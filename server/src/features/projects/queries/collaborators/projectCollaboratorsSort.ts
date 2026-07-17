import type { PipelineStage } from "mongoose";
import { ProjectCollaboratorQuery } from "@/features/projects/validation/projectCollaboratorSchema.validator";

export const buildProjectCollaboratorSort = (
  collaboratorsSort: ProjectCollaboratorQuery["collaboratorsSort"],
): PipelineStage.Sort["$sort"] => {
  switch (collaboratorsSort) {
    case "name_asc":
      return { name: 1, _id: 1 };

    case "name_desc":
      return { name: -1, _id: 1 };

    case "email_asc":
      return { email: 1, _id: 1 };

    case "email_desc":
      return { email: -1, _id: 1 };

    case "role_asc":
      return { role: 1, _id: 1 };

    case "role_desc":
      return { role: -1, _id: 1 };

    default:
      return { name: 1, _id: 1 };
  }
};
