import type { Comment } from "@shared/types/comment";
import type { User } from "@shared/types/user";

export type CommentWithUser = Comment & {
  user?: User;
};
