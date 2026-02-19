import Avatar from "@/components/projects/avatar/Avatar";
import type { CommentsWithUser } from "@/type/commentsWithUser";
import { formatDate } from "@/utils/formatDate";

type CommentProps = {
  comment: CommentsWithUser;
};

const Comment = ({ comment }: CommentProps) => {
  const { message, userId, createdAt, user } = comment;
  return (
    <>
      <Avatar avatarKey={user?.avatarKey} />
      <div>
        <p>{message}</p>
        <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
      </div>
    </>
  );
};
export default Comment;
