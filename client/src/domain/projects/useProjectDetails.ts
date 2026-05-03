import { useAppStore } from "@/store";
import { getArrayLookup } from "@/shared/utils/getArrayLookup";
import { isDefined } from "@/shared/utils/isDefined";
import { useMemo } from "react";
import { groupBy } from "@/shared/utils/groupBy";
import { useProjectDetails } from "@/features/projects/hooks/useProjectDetails";
import type { ProjectDetailsVM } from "@/features/projects/types/projectsWithMeta";

// refactor later
export const useProjectDetailsVM = (projectId: string): ProjectDetailsVM => {
  const { data: details, isLoading, error } = useProjectDetails(projectId);

  const project = details?.project;
  const tasks = details?.tasks ?? [];
  const comments = details?.comments ?? [];
  const attachments = details?.attachments ?? [];
  const users = details?.users ?? [];

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

  if (!project) {
    return {
      project: null,
      isLoading,
      error,
    };
  }

  const tasksForProject = tasksByProjectId.get(project.id) ?? [];
  const badge = badgeByProjectId[project.id];

  const enrichedTasks = tasksForProject.map((task) => {
    const comments = commentsByTaskId.get(task.id) ?? [];
    const attachments = attachmentsByTaskId.get(task.id) ?? [];

    const collaborators = (task.collaboratorIds ?? [])
      .map((userId) => usersById.get(userId))
      .filter(isDefined);

    return {
      ...task,
      comments,
      attachments,
      collaborators,
    };
  });

  const teamUserIdSet = new Set<string>(project.invitedUserIds ?? []);

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

  const projectDetails = {
    ...project,
    badge,
    tasks: enrichedTasks,
    meta,
    teamUserIds,
  };

  return {
    project: projectDetails,
    isLoading,
    error,
  };
};
