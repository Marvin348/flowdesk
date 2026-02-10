import { mockComments } from "@/data/mockComments";
import type { Comments } from "@/type/comments";
import type { StateCreator } from "zustand";
import type { AppStore } from "@/store";

export type CommentsSlice = {
  comments: Comments[];
};

export const createCommentsSlice: StateCreator<
  AppStore,
  [],
  [],
  CommentsSlice
> = () => ({
  comments: mockComments,
});
