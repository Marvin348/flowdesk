import { useUsers } from "@/queries/useUsers";
import { useComments } from "@/queries/useComments";
import { useAttachments } from "@/queries/useAttachments";
import { useTasks } from "@/queries/useTasks";

export const useProjectDomainData = () => {
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
