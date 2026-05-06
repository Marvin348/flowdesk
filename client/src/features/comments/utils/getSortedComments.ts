import type { SortOrder } from "@/features/projects/components/projectDetailsPage/tabs/comments/CommentsView";
import type { Comment } from "@shared/types/comment";

// LATER IN BACKEND

export const getSortedComments = (comments: Comment[], value: SortOrder) => {
  if (value === "newest") {
    return [...comments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else {
    return [...comments].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }
};
