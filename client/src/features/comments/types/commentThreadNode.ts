import type { CommentWithUser } from "@/features/comments/types/commentWithUser";

export type CommentThreadNode = CommentWithUser & {
  taskTitle: string;
  replies?: CommentThreadNode[];
};
