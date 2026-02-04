import { mockComments } from "@/mock/mockComments";
import type { Comments } from "@/type/comments";

export type CommentsSlice = {
  comments: Comments[];
};

export const createCommentsSlice = () => ({
  comments: mockComments,

});
