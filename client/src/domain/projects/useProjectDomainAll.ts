import { useUsers } from "@/queries/users/useUsers";
import { useComments } from "@/queries/comments/useComments";
import { useAttachments } from "@/queries/attachments/useAttachments";
import { useTasks } from "@/queries/tasks/useTasks";

export const useProjectDomainAll = () => {
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
    data: tasks = [],
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useTasks();
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
