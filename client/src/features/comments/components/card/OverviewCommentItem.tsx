import Avatar from "@/shared/components/ui/avatar/Avatar";
import type { CommentWithUser } from "@/features/comments/types/commentWithUser";
import { formatDate } from "@/shared/utils/formatDate";

const OverviewCommentItem = ({ comment }: { comment: CommentWithUser }) => {
  const { user, message, createdAt } = comment;

  return (
    <div className="flex gap-2 border-b last:border-none py-2">
      <div className="shrink-0">
        <Avatar avatarKey={user?.avatarKey} size="sm" />
      </div>
      <div>
        <p>{message}</p>
        <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};
export default OverviewCommentItem;
