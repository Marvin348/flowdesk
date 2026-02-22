import { useAppStore } from "@/store";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import { getArrayLookup } from "@/utils/getArrayLookup";
import { isDefined } from "@/utils/isDefined";
import { useMemo } from "react";
import { groupBy } from "@/utils/groupBy";
import { useProjectDomainData } from "@/queries/useProjectDomainData";
import { useProjects } from "@/queries/useProjects";

export const useProjectsWithMeta = () => {
  const { data: projects = [] } = useProjects();

  const {
    data: { users, tasks, comments, attachments },
  } = useProjectDomainData();

  const badgeByProjectId = useAppStore((state) => state.badgeByProjectId);

  const usersById = useMemo(() => getArrayLookup(users), [users]);
  const tasksByProjectId = useMemo(
    () => groupBy(tasks, (t) => t.projectId),
    [tasks],
  );
  const commentsByTaskId = useMemo(
    () => groupBy(comments, (com) => com.taskId),
    [comments],
  );
  const attachmentsByTaskId = useMemo(
    () => groupBy(attachments, (att) => att.taskId),
    [attachments],
  );

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

    const teamUserIds = Array.from(counts.uniqueUserIds);

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
