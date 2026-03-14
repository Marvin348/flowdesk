export type Comments = {
  id: string;
  taskId: string;
  userId: string;
  message: string;
  createdAt: string;
  parentCommentId?: string
};
