import { useCommentsWithUsers } from "@/hooks/useCommentsWithUsers";
import CommentThreadItem from "./CommentThreadItem";
import type { Comments } from "@/type/comments";

const CommentThreadList = ({ comments }: { comments: Comments[] }) => {
  const commentsWithUser = useCommentsWithUsers(comments);
  return (
    <div>
      {commentsWithUser.map((com) => (
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
