import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Comment from "./Comment";
import type { CommentsWithUser } from "@/type/commentsWithUser";

type CommentsListProps = {
  comments: CommentsWithUser[];
};

const CommentsList = ({ comments }: CommentsListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-4 bg-muted-foreground/10 p-4">
        <h4 className="text-lg font-medium">Kommentare</h4>
        <Button>
          <Plus className="text-accent" /> <span>Kommentar</span>
        </Button>
      </div>

      <div className="flex-1 p-4 max-h-200 overflow-y-auto">
        {comments.map((com) => (
          <div
            key={com.id}
            className="flex  gap-2 border-b last:border-none py-2"
          >
            <Comment comment={com} />
          </div>
        ))}
      </div>

      <div className="pb-4 px-4">
        <Button
          variant="outline"
          className="w-full hover:bg-muted-foreground/5"
        >
          Alle Ansehen
        </Button>
      </div>
    </div>
  );
};
export default CommentsList;
