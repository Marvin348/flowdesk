export type ProjectCommentDto = {
  id: string;
  message: string;
  createdAt: string;
  parentCommentId?: string;

  task: {
    id: string;
    title: string;
  };

  user: {
    id: string;
    name: string;
    avatarKey?: string;
    avatarUrl?: string;
  } | null;
};

export type TaskOptionDto = {
  taskId: string;
  taskTitle: string;
};

export type ProjectCommentsDto = {
  comments: ProjectCommentDto[];
  taskOptions: TaskOptionDto[];
};

export type ProjectCommentsResponseDto = {
  comments: ProjectCommentDto[];
  taskOptions: TaskOptionDto[];

  totalItems: number;
  hasMore: boolean;
};
