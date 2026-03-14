import type { CommentsWithUser } from "@/type/commentsWithUser";
import Avatar from "@/components/projects/avatar/Avatar";
import { formatDate } from "@/utils/formatDate";
import { Reply } from "lucide-react";
import { useState } from "react";
import ReplyForm from "./thread/ReplyForm";

const CommentThreadItem = ({ comment }: { comment: CommentsWithUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, message, createdAt } = comment;

  const toggleReblyBtn = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex gap-2 pb-10">
      <div className="shrink-0">
        <Avatar avatarKey={user?.avatarKey} />
      </div>

      <div>
        <div className="flex items-center gap-3">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(createdAt)}
          </p>
        </div>
        <p>{message}</p>

        <div className="my-1 flex items-center gap-6 text-muted-foreground">
          <button
            className="flex items-center gap-1 text-sm hover:text-surface"
            onClick={toggleReblyBtn}
          >
            <Reply className="size-4" /> Antworten
          </button>
        </div>

        {isOpen && <ReplyForm />}
      </div>
    </div>
  );
};
export default CommentThreadItem;
