import Avatar from "@/components/projects/avatar/Avatar";
import type { CommentsWithUser } from "@/type/commentsWithUser";
import { formatDate } from "@/utils/formatDate";
import type { User } from "@/type/user";

type CommentProps = {
  comment: CommentsWithUser;
  user?: User;
};

const Comment = ({ comment, user }: CommentProps) => {
  const { message, createdAt } = comment;

  return (
    <>
      <div className="shrink-0">
        <Avatar avatarKey={user?.avatarKey} />
      </div>
      <div>
        <p>{message}</p>
        <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
      </div>
    </>
  );
};
export default Comment;
