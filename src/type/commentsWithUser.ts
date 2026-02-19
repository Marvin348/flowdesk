import type { Comments } from "@/type/comments";
import type { User } from "@/type/user";

export type CommentsWithUser = Comments & {
  user?: User;
};
