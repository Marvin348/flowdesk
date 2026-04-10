import { useComments } from "@/queries/comments/useComments";
import { useAttachments } from "@/queries/attachments/useAttachments";
import { useUsers } from "@/queries/users/useUsers";
import { useProjectTasks } from "@/queries/tasks/useProjectTasks";
import { getArrayLookup } from "@/utils/getArrayLookup";

// /:id/details

export const useProjectDomain = (projectId: string) => {
  const {
    data: tasks = [],
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useProjectTasks(projectId);

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

  const {
    data: users = [],
    isLoading: usersIsLoading,
    error: usersError,
  } = useUsers();

  const taskIds = getArrayLookup(tasks);

  const projectComments = comments.filter((com) => taskIds.get(com.taskId));

  const projectAttachments = attachments.filter((att) =>
    taskIds.get(att.taskId));


  const isLoading =
    usersIsLoading ||
    commentsIsLoading ||
    tasksIsLoading ||
    attachmentsIsLoading;

  const error = usersError ?? commentsError ?? tasksError ?? attachmentsError;

  return {
    data: {
      tasks,
      users,
      comments: projectComments,
      attachments: projectAttachments,
    },
    isLoading,
    error,
  };
};
