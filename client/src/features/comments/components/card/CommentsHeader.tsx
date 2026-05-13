import { ArrowDownUp} from "lucide-react";
import type { ProjectCommentsSort } from "@shared/types/sort/projectCommentsSort";

type CommentsHeaderProps = {
  commentsSort: ProjectCommentsSort;
  commentsCount: number;
  toggleOrder: () => void;
};

const CommentsHeader = ({
  commentsSort,
  commentsCount,
  toggleOrder,
}: CommentsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-end gap-2">
        <h4 className="text-xl font-medium">Kommentare</h4>
        <span className="text-accent font-semibold">{commentsCount}</span>
      </div>

      <button className="text-sm flex items-center gap-1" onClick={toggleOrder}>
        <ArrowDownUp className="size-4 text-muted-foreground" />
        {commentsSort === "newest" ? "Älteste zuerst" : "Neueste zuerst"}
      </button>
    </div>
  );
};
export default CommentsHeader;
