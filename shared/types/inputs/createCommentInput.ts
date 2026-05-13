export type CreateCommentInput = {
  projectId: string;
  taskId: string;
  message: string;
  parentCommentId?: string;
};
