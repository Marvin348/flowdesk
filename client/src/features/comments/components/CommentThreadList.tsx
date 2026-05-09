import CommentThreadItem from "@/features/comments/components/CommentThreadItem";
import type { CommentThreadNode } from "@/features/comments/types/commentThreadNode";
import type { ProjectCommentDto } from "@shared/types/dto/projects/projectComments.dto";

type CommentThreadListProps = {
  comments: ProjectCommentDto[];
};

const CommentThreadList = ({ comments }: CommentThreadListProps) => {
  const rootComments = comments.filter((com) => !com.parentCommentId);
  const replyComments = comments.filter((com) => com.parentCommentId);

  const buildReplies = (comment: ProjectCommentDto): CommentThreadNode => {
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
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Keine Kommentare
        </div>
      )}
    </div>
  );
};
export default CommentThreadList;
