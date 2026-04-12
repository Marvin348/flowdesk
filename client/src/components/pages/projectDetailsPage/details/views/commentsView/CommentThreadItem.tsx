import Avatar from "@/components/users/avatar/Avatar";
import { formatDate } from "@/utils/formatDate";
import { Reply } from "lucide-react";
import { useState } from "react";
import ReplyForm from "./thread/ReplyForm";
import type { CommentThreadNode } from "@/type/view-models/commentThreadNode";

const CommentThreadItem = ({ comment }: { comment: CommentThreadNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { id, taskId, user, message, createdAt, replies, taskTitle } = comment;

  const toggleReblyBtn = () => setIsOpen((prev) => !prev);

  return (
    <article className="flex gap-2 pb-6">
      <div className="shrink-0">
        <Avatar avatarKey={user?.avatarKey} />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <p className="font-medium">{user?.name ?? "UNKNOWN"}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(createdAt)}
          </p>
        </div>
        <p className="my-0.5 text-xs text-surface/90">{taskTitle}</p>
        <p>{message}</p>

        <div className="mt-1 flex items-center gap-6 text-muted-foreground">
          <button
            className="flex items-center gap-1 text-xs transition-all duration-300 hover:text-surface"
            onClick={toggleReblyBtn}
          >
            <Reply className="size-4" /> Antworten
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-400 max-w-md ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <ReplyForm commentId={id} taskId={taskId} />
        </div>

        {replies && (
          <div className="mt-2">
            {replies.map((re) => (
              <CommentThreadItem key={re.id} comment={re} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
export default CommentThreadItem;
