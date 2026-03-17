import type { CommentWithUser } from "@/type/view-models/commentWithUser";

export type CommentThreadNode = CommentWithUser & {
  taskTitle: string;
  replies?: CommentThreadNode[]
};
