import type { Comments } from "@/type/domain/comments";
import type { User } from "@/type/domain/user";

export type CommentWithUser = Comments & {
  user?: User;
  replies?: CommentWithUser[];
};
