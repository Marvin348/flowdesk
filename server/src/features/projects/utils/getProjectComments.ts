import { Comment } from "@shared/types/comment.js";
import { Task } from "@shared/types/task.js";
import { User } from "@shared/types/user.js";
import type {
  ProjectCommentDto,
  ProjectCommentsDto,
} from "@shared/types/dto/projects/projectComments.dto.js";

export const getProjectComments = (
  comments: Comment[],
  tasksById: Map<string, Task>,
  usersById: Map<string, User>,
): ProjectCommentsDto => {
  const matchesComments: ProjectCommentDto[] = comments.map((c) => {
    const user = usersById.get(c.userId);
    const task = tasksById.get(c.taskId)!;

    return {
      ...c,
      user: user
        ? {
            id: user.id,
            name: user.name,
            avatarKey: user.avatarKey,
          }
        : null,
      task: {
        id: task.id,
        title: task.title,
      },
    };
  });

  const taskOptions = Array.from(tasksById.values()).map((t) => ({
    taskId: t.id,
    taskTitle: t.title,
  }));

  return {
    comments: matchesComments,
    taskOptions,
  };
};
