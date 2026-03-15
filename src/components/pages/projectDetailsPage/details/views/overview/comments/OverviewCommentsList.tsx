import { useCommentsWithUsers } from "@/hooks/useCommentsWithUsers";
import type { Comments } from "@/type/domain/comments";
import OverviewCommentItem from "./OverviewCommentItem";

const OverviewCommentsList = ({ comments }: { comments: Comments[] }) => {
  const commentsWithUser = useCommentsWithUsers(comments);
  // useCommentsWithUsers hook in 2 Listen (hier, CommentThreadList)

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
