import { useCommentsWithUsers } from "@/features/comments/hooks/useCommentsWithUsers";
import type { Comment } from "@shared/types/comment";
import OverviewCommentItem from "@/features/comments/components/card/OverviewCommentItem";

const OverviewCommentsList = ({ comments }: { comments: Comment[] }) => {
  const commentsWithUser = useCommentsWithUsers(comments);
  // useCommentsWithUsers hook called twice (here, CommentThreadList)

  return (
    <div className="p-4">
      {commentsWithUser.map((com) => (
        <OverviewCommentItem key={com.id} comment={com} />
      ))}
      {comments.length === 0 && (
        <div className="h-full flex items-center justify-center">
          Keine Kommentare
        </div>
      )}
    </div>
  );
};
export default OverviewCommentsList;
