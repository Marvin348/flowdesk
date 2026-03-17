import type { Comments } from "@/type/domain/comments";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import type { SortOrder } from "./CommentsView";

type CommentsHeaderProps = {
  comments: Comments[];
  toggleOrder: () => void;
  sortOrder: SortOrder;
};

const CommentsHeader = ({
  comments,
  toggleOrder,
  sortOrder,
}: CommentsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-end gap-2">
        <h4 className="text-xl font-medium">Kommentare</h4>
        <span className="text-accent font-semibold">{comments.length}</span>
      </div>

      <button className="text-sm flex items-center gap-1" onClick={toggleOrder}>
        <ArrowDownUp className="size-4 text-surface/90" />
        {sortOrder === "newest" ? "Älteste zuerst" : "Neuste zuerst"}
        <ChevronDown className="size-4 text-surface/90" />
      </button>
    </div>
  );
};
export default CommentsHeader;
