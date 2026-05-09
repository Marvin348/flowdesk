import { emitKeypressEvents } from "node:readline";

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
    avatarKey: string;
  } | null;
};

export type TaskOptionDto = {
  taskId: string;
  taskTitle: string;
};

export type ProjectCommentsResponseDto = {
  comments: ProjectCommentDto[];
  taskOptions: TaskOptionDto[];
};
