import Avatar from "@/shared/components/ui/avatar/Avatar";
import { formatDate } from "@/shared/utils/formatDate";
import { Reply } from "lucide-react";
import { useState } from "react";
import ReplyForm from "@/features/comments/components/thread/ReplyForm";
import type { CommentThreadNode } from "@/features/comments/types/commentThreadNode";

type CommentThreadItemProps = {
  comment: CommentThreadNode;
  projectId: string;
};

const CommentThreadItem = ({ comment, projectId }: CommentThreadItemProps) => {
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const { id, task, user, message, createdAt, replies } = comment;

  const toggleReply = (id: string) =>
    setReplyOpenId((prev) => (prev === id ? null : id));

  return (
    <article className="flex gap-2 pb-6">
      <div className="shrink-0">
        <Avatar avatarKey={user?.avatarKey} size="sm" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <p className="font-medium">{user?.name ?? "UNKNOWN"}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(createdAt)}
          </p>
        </div>
        <p className="my-0.5 text-xs text-muted-foreground">{task.title}</p>
        <p>{message}</p>

        <div className="mt-1 flex items-center gap-6 text-muted-foreground">
          <button
            className="flex items-center gap-1 text-xs transition-all duration-300"
            onClick={() => toggleReply(id)}
          >
            <Reply className="size-4" /> Antworten
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-400 max-w-md ${replyOpenId === id ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
        >
          <ReplyForm
            commentId={id}
            taskId={task.id}
            projectId={projectId}
            onCloseReply={() => setReplyOpenId(null)}
          />
        </div>

        {replies && (
          <div className="mt-2">
            {replies.map((re) => (
              <CommentThreadItem
                key={re.id}
                comment={re}
                projectId={projectId}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
export default CommentThreadItem;
