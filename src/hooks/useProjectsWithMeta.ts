import { useAppStore } from "@/store";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import { getArrayLookup } from "@/utils/getArrayLookup";
import { isDefined } from "@/utils/isDefined";
import { useMemo } from "react";

export const useProjectsWithMeta = () => {
  const projects = useAppStore((state) => state.projects);
  const comments = useAppStore((state) => state.comments);
  const users = useAppStore((state) => state.users);
  const tasks = useAppStore((state) => state.tasks);
  const attachments = useAppStore((state) => state.attachments);
  const badgeByProjectId = useAppStore((state) => state.badgeByProjectId);

  const commentsMap = useMemo(() => getArrayLookup(comments), [comments]);
  const usersMap = useMemo(() => getArrayLookup(users), [users]);
  const tasksMap = useMemo(() => getArrayLookup(tasks), [tasks]);
  const attachmentsMap = useMemo(
    () => getArrayLookup(attachments),
    [attachments],
  );

  const projectsWithMeta: ProjectsWithMeta[] = useMemo(() => {
    return projects.map((project) => {
      const comments = project.commentIds
        .map((id) => commentsMap.get(id))
        .filter(isDefined);

      const commentsWithUser = comments.map((com) => {
        const matchesUser = usersMap.get(com.userId);

        return {
          ...com,
          user: matchesUser,
        };
      });

      const users = project.assigneeIds
        .map((id) => usersMap.get(id))
        .filter(isDefined);

      const tasks = project.taskIds
        .map((id) => tasksMap.get(id))
        .filter(isDefined);

      const attachments = project.attachmenetIds
        ?.map((id) => attachmentsMap.get(id))
        .filter(isDefined);

      const badge = badgeByProjectId[project.id];

      return {
        ...project,
        comments: commentsWithUser,
        users,
        tasks,
        attachments,
        badge,
      };
    });
  }, [
    projects,
    commentsMap,
    usersMap,
    tasksMap,
    attachmentsMap,
    badgeByProjectId,
  ]);

  return projectsWithMeta;
};
