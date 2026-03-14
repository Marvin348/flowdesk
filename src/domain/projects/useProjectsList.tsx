import { useProjectDomainAll } from "@/domain/projects/useProjectDomainAll";
import { useProjects } from "@/queries/projects/useProjects";
import { useAppStore } from "@/store";
import { useMemo } from "react";
import { groupBy } from "@/utils/groupBy";
import type { ProjectsList } from "@/type/projectsList";

export const useProjectsListVM = () => {
  const { data: projects = [] } = useProjects();
  const {
    data: { tasks, comments, attachments },
  } = useProjectDomainAll();

  const badgeByProjectId = useAppStore((state) => state.badgeByProjectId);

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

  const projectsList: ProjectsList[] = projects.map((pro) => {
    const tasks = tasksByProjectId.get(pro.id) ?? [];

    const badge = badgeByProjectId[pro.id];

    const teamUserIdSet = new Set<string>(pro.invitedUserIds);

    const counts = tasks.reduce(
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

    const meta = {
      taskCount: tasks.length,
      commentCount: counts.commentCount,
      attachmentCount: counts.attachmentCount,
      completedTaskCount: counts.completedTaskCount,
      userCount: teamUserIds.length,
    };

    const progress = {
      total: meta.taskCount,
      completed: meta.completedTaskCount,
      percent: meta.taskCount
        ? Math.round((meta.completedTaskCount / meta.taskCount) * 100)
        : 0,
    };

    return {
      ...pro,
      badge,
      meta,
      progress,
      teamUserIds,
    };
  });

  return projectsList;
};
