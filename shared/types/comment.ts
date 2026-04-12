export type Comment = {
  id: string;
  taskId: string;
  userId: string;
  message: string;
  createdAt: string;
  parentCommentId?: string
};
