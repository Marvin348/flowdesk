import { useTasks } from "@/queries/tasks/useTasks";
import { useComments } from "@/queries/comments/useComments";
import { useAttachments } from "@/queries/attachments/useAttachments";
import { useUsers } from "@/queries/users/useUsers";

export const useProjectDomain = (projectId: string) => {
  const {
    data: tasks = [],
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useTasks(projectId);

  const {
    data: users = [],
    isLoading: usersIsLoading,
    error: usersError,
  } = useUsers();

  const {
    data: comments = [],
    isLoading: commentsIsLoading,
    error: commentsError,
  } = useComments();

  const {
    data: attachments = [],
    isLoading: attachmentsIsLoading,
    error: attachmentsError,
  } = useAttachments();

  const isLoading =
    usersIsLoading ||
    commentsIsLoading ||
    tasksIsLoading ||
    attachmentsIsLoading;

  const error = usersError ?? commentsError ?? tasksError ?? attachmentsError;

  return {
    data: { users, comments, tasks, attachments },
    isLoading,
    error,
  };
};
