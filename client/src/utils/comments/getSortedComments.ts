import type { SortOrder } from "@/components/pages/projectDetailsPage/details/views/commentsView/CommentsView";
import type { Comment } from "@shared/types/comment";

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