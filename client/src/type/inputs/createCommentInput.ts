export type CreateCommentInput = {
  taskId: string;
  message: string;
  parentCommentId?: string;
};
