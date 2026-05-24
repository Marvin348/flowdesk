import { Attachment } from "@shared/types/attachment.js";
import { Comment } from "@shared/types/comment.js";
import type { ProjectSummariesDto } from "@shared/types/dto/projects/projectSummary.dto.js";
import { Project } from "@shared/types/project.js";
import { Task } from "@shared/types/task.js";
import { calcPercent } from "@/shared/utils/calcPercent.js";
import { toUserAvatarDto } from "@/features/users/mappers/user.mapper.js";
import { User } from "@shared/types/user.js";
import { isDefined } from "@/shared/utils/isDefined.js";

export const toProjectsSummaryDto = (
  projects: Project[],
  tasks: Task[],
  comments: Comment[],
  attachments: Attachment[],
  usersById: Map<string, User>,
): ProjectSummariesDto[] => {
  // refactor later
  const tasksByProjectId = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const existing = tasksByProjectId.get(task.projectId) ?? [];
    existing.push(task);
    tasksByProjectId.set(task.projectId, existing);
  }

  const commentsByTaskId = new Map<string, typeof comments>();
  for (const comment of comments) {
    const existing = commentsByTaskId.get(comment.taskId) ?? [];
    existing.push(comment);
    commentsByTaskId.set(comment.taskId, existing);
  }

  const attachmentsByTaskId = new Map<string, typeof attachments>();
  for (const attachment of attachments) {
    const existing = attachmentsByTaskId.get(attachment.taskId) ?? [];
    existing.push(attachment);
    attachmentsByTaskId.set(attachment.taskId, existing);
  }

  const projectListItems = projects.map((p): ProjectSummariesDto => {
    const projectTasks = tasksByProjectId.get(p.id) ?? [];

    const counts = projectTasks.reduce(
      (acc, task) => {
        acc.commentCount += (commentsByTaskId.get(task.id) ?? []).length;
        acc.attachmentCount += (attachmentsByTaskId.get(task.id) ?? []).length;

        if (task.taskStatus === "done") {
          acc.completedTaskCount += 1;
        }

        return acc;
      },
      {
        commentCount: 0,
        attachmentCount: 0,
        completedTaskCount: 0,
      },
    );

    const total = projectTasks.length;
    const completed = counts.completedTaskCount;

    const progress = {
      total,
      completed,
      progressPercent: calcPercent(completed, total),
    };

    const invitedUserIds = Array.from(new Set(p.invitedUserIds));
    const invitedUsers = invitedUserIds
      .map((id) => usersById.get(id))
      .filter(isDefined)
      .map(toUserAvatarDto);

    return {
      id: p.id,
      title: p.title,
      priority: p.priority,
      projectStatus: p.projectStatus,
      dueDate: p.dueDate,
      invitedUserIds,
      invitedUsers,
      createdAt: p.createdAt,

      progress,

      stats: {
        commentCount: counts.commentCount,
        attachmentCount: counts.attachmentCount,
        userCount: invitedUserIds.length,
      },
    };
  });

  return projectListItems;
};
