import type { ProjectCommentDto } from "@shared/types/dto/projects/projectComments.dto.js";
import { ProjectCommentsSort } from "@shared/types/sort/projectCommentsSort.js";

export const sortedComments = (
  comments: ProjectCommentDto[],
  sort?: ProjectCommentsSort,
) => {
  if (!sort) return comments;

  return [...comments].sort((a, b) => {
    switch (sort) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }
  });
};
