import { useCommentsWithUsers } from "@/hooks/useCommentsWithUsers";
import CommentThreadItem from "./CommentThreadItem";
import type { Comments } from "@/type/domain/comments";
import type { CommentWithUser } from "@/type/view-models/commentWithUser";

const CommentThreadList = ({ comments }: { comments: Comments[] }) => {
  const commentsWithUser = useCommentsWithUsers(comments);

  const replyComments = commentsWithUser.filter((com) => com.parentCommentId);
  const rootComments = commentsWithUser.filter((com) => !com.parentCommentId);

  const buildReplies = (comment: CommentWithUser): CommentWithUser => {
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
        <CommentThreadItem key={com.id} comment={com}/>
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
