import Avatar from "@/components/projects/avatar/Avatar";
import type { CommentWithUser } from "@/type/view-models/commentWithUser";
import { formatDate } from "@/utils/formatDate";

const OverviewCommentItem = ({ comment }: { comment: CommentWithUser }) => {
  const { user, message, createdAt } = comment;

  return (
    <div className="flex gap-2 border-b last:border-none py-2">
      <div className="shrink-0">
        <Avatar avatarKey={user?.avatarKey} />
      </div>
      <div>
        <p>{message}</p>
        <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};
export default OverviewCommentItem;
