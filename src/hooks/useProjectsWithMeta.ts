import { useAppStore } from "@/store";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import { getArrayLookup } from "@/utils/getArrayLookup";
import { isDefined } from "@/utils/isDefined";
import { useMemo } from "react";
import { groupBy } from "@/utils/groupBy";

export const useProjectsWithMeta = () => {
  const projects = useAppStore((state) => state.projects);
  const comments = useAppStore((state) => state.comments);
  const users = useAppStore((state) => state.users);
  const tasks = useAppStore((state) => state.tasks);
  const attachments = useAppStore((state) => state.attachments);
  const badgeByProjectId = useAppStore((state) => state.badgeByProjectId);

  const usersById = getArrayLookup(users);
  const tasksByProjectId = groupBy(tasks, (t) => t.projectId);
  const commentsByTaskId = groupBy(comments, (com) => com.taskId);
  const attachmentsByTaskId = groupBy(attachments, (att) => att.taskId);

  const projectsWithMeta: ProjectsWithMeta[] = projects.map((pro) => {
    const tasks = tasksByProjectId.get(pro.id) ?? [];

    const badge = badgeByProjectId[pro.id];

    const enrichedTasks = tasks.map((task) => {
      const comments = commentsByTaskId.get(task.id) ?? [];
      const attachments = attachmentsByTaskId.get(task.id) ?? [];

      const collaborators = task.collaboratorIds
        .map((user) => usersById.get(user))
        .filter(isDefined);

      return {
        ...task,
        comments,
        attachments,
        collaborators,
      };
    });

    const counts = enrichedTasks.reduce(
      (acc, task) => {
        acc.commentCount += task.comments.length;
        acc.attachmentCount += task.attachments.length;

        for (const userId of task.collaboratorIds) {
          acc.uniqueUserIds.add(userId);
        }

        return acc;
      },
      {
        commentCount: 0,
        attachmentCount: 0,
        uniqueUserIds: new Set<string>(),
      },
    );

    const meta = {
      taskCount: enrichedTasks.length,
      commentCount: counts.commentCount,
      attachmentCount: counts.attachmentCount,
      userCount: counts.uniqueUserIds.size,
    };

    const collaboratorIds = tasks.flatMap((t) => t.collaboratorIds);
    const teamUserIds = Array.from(new Set(collaboratorIds));

    return {
      ...pro,
      badge,
      tasks: enrichedTasks,
      teamUserIds,
      meta,
    };
  });

  return projectsWithMeta;
};
