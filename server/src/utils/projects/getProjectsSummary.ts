import { Attachment } from "@shared/types/attachment.js";
import { Comment } from "@shared/types/comment.js";
import type { ProjectSummariesDto } from "@shared/types/dto/project.js";
import { Project } from "@shared/types/project.js";
import { Task } from "@shared/types/task.js";

export const getProjectsSummary = (
  projects: Project[],
  tasks: Task[],
  comments: Comment[],
  attachments: Attachment[],
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

    const teamUserIdSet = new Set<string>(p.invitedUserIds);

    const counts = projectTasks.reduce(
      (acc, task) => {
        acc.commentCount += (commentsByTaskId.get(task.id) ?? []).length;
        acc.attachmentCount += (attachmentsByTaskId.get(task.id) ?? []).length;

        if (task.taskStatus === "done") {
          acc.completedTaskCount += 1;
        }

        for (const userId of task.collaboratorIds) {
          teamUserIdSet.add(userId);
        }

        return acc;
      },
      {
        commentCount: 0,
        attachmentCount: 0,
        completedTaskCount: 0,
      },
    );

    const teamUserIds = Array.from(teamUserIdSet);

    return {
      id: p.id,
      title: p.title,
      priority: p.priority,
      projectStatus: p.projectStatus,
      dueDate: p.dueDate,
      teamUserIds,
      createdAt: p.createdAt,

      stats: {
        taskCount: projectTasks.length,
        commentCount: counts.commentCount,
        attachmentCount: counts.attachmentCount,
        completedTaskCount: counts.completedTaskCount,
        userCount: teamUserIds.length,
      },
    };
  });

  return projectListItems;
};
