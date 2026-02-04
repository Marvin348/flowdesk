import { mockComments } from "@/data/mockComments";
import type { Comments } from "@/type/comments";

export type CommentsSlice = {
  comments: Comments[];
};

export const createCommentsSlice = () => ({
  comments: mockComments,
});
