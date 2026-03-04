import { useAppStore } from "@/store";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import { getArrayLookup } from "@/utils/getArrayLookup";
import { isDefined } from "@/utils/isDefined";
import { useMemo } from "react";
import { groupBy } from "@/utils/groupBy";
import { useProjects } from "@/queries/projects/useProjects";
import { useProjectDomain } from "./useProjectDomain";

export const useProjectDetailsVM = (projectId: string) => {
  const { data: projects = [] } = useProjects(projectId);

  const {
    data: { users, tasks, comments, attachments },
  } = useProjectDomain(projectId);

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

  const useProjectDetailsVM: ProjectsWithMeta[] = projects.map((pro) => {
    const tasks = tasksByProjectId.get(pro.id) ?? [];

    const badge = badgeByProjectId[pro.id];

    const enrichedTasks = tasks.map((task) => {
      const comments = commentsByTaskId.get(task.id) ?? [];
      const attachments = attachmentsByTaskId.get(task.id) ?? [];

      const collaborators = (task.collaboratorIds ?? [])
        .map((user) => usersById.get(user))
        .filter(isDefined);

      return {
        ...task,
        comments,
        attachments,
        collaborators,
      };
    });

    const teamUserIdSet = new Set<string>(pro.invitedUserIds ?? []);

    const counts = enrichedTasks.reduce(
      (acc, task) => {
        acc.commentCount += task.comments.length;
        acc.attachmentCount += task.attachments.length;

        for (const userId of task.collaboratorIds) {
          teamUserIdSet.add(userId);
        }

        return acc;
      },
      {
        commentCount: 0,
        attachmentCount: 0,
      },
    );

    const teamUserIds = Array.from(teamUserIdSet);

    const meta = {
      taskCount: enrichedTasks.length,
      commentCount: counts.commentCount,
      attachmentCount: counts.attachmentCount,
      userCount: teamUserIds.length,
    };

    return {
      ...pro,
      badge,
      tasks: enrichedTasks,
      meta,
      teamUserIds,
    };
  });

  return useProjectDetailsVM;
};
