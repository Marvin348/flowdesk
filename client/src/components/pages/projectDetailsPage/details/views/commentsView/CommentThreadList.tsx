import { useCommentsWithUsers } from "@/hooks/useCommentsWithUsers";
import CommentThreadItem from "@/components/pages/projectDetailsPage/details/views/commentsView/CommentThreadItem";
import type { Comments } from "@/type/domain/comments";
import type { Task } from "@/type/domain/task";
import { getArrayLookup } from "@/utils/getArrayLookup";
import type { CommentThreadNode } from "@/type/view-models/commentThreadNode";

type CommentThreadListProps = {
  comments: Comments[];
  tasks: Task[];
};

const CommentThreadList = ({ comments, tasks }: CommentThreadListProps) => {
  const commentsWithUser = useCommentsWithUsers(comments);
  const tasksById = getArrayLookup(tasks);

  // later refactor
  const commentThreadNode: CommentThreadNode[] = commentsWithUser
    .map((com) => {
      const matchesTask = tasksById.get(com.taskId);

      if (!matchesTask) return null;

      return {
        ...com,
        taskTitle: matchesTask?.title,
      };
    })
    .filter((com) => com !== null);

  const replyComments = commentThreadNode.filter((com) => com.parentCommentId);
  const rootComments = commentThreadNode.filter((com) => !com.parentCommentId);

  const buildReplies = (comment: CommentThreadNode): CommentThreadNode => {
    const replies = replyComments.filter(
      (re) => re.parentCommentId === comment.id,
    );

    return {
      ...comment,
      replies: replies.map((re) => buildReplies(re)),
    };
  };

  const threadComment = rootComments.map((com) => buildReplies(com));

  return (
    <div>
      {threadComment.map((com) => (
        <CommentThreadItem key={com.id} comment={com} />
      ))}
      {comments.length === 0 && (
        <div className="h-full flex items-center justify-center">
          Keine Kommentare
        </div>
      )}
    </div>
  );
};
export default CommentThreadList;
