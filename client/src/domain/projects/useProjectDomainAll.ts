import { useUsers } from "@/features/users/hooks/useUsers";
import { useComments } from "@/features/comments/hooks/useComments";
import { useAttachments } from "@/features/attachments/hooks/useAttachments";
import { useTasks } from "@/features/tasks/hooks/useTasks";

// refactor later
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
