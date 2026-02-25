import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Comment from "@/components/projects/details/comments/Comment";
import type { CommentsWithUser } from "@/type/commentsWithUser";
import { useMemo } from "react";
import { useUsers } from "@/queries/useUsers";

type CommentsListProps = {
  comments: CommentsWithUser[];
};

const CommentsList = ({ comments }: CommentsListProps) => {
  const { data: users = [] } = useUsers();

  const userByIds = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-4 bg-muted-foreground/10 p-4">
        <h4 className="text-lg font-medium">Kommentare</h4>
        <Button>
          <Plus className="text-accent" /> <span>Kommentare</span>
        </Button>
      </div>

      <div className="flex-1 min-h-0 relative">
        <div className="p-4 h-full overflow-y-auto custom-scrollbar">
          {comments.map((com) => {
            const user = userByIds.get(com.userId);

            return (
              <div
                key={com.id}
                className="flex gap-2 border-b last:border-none py-2"
              >
                <Comment comment={com} user={user} />
              </div>
            );
          })}
          {comments.length === 0 && (
            <div className="h-full flex items-center justify-center">
              Keine Kommentare
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="pb-4 px-4">
        <Button
          variant="outline"
          className="w-full hover:bg-muted-foreground/5"
        >
          Alle Ansehen ({comments.length})
        </Button>
      </div>
    </div>
  );
};
export default CommentsList;
