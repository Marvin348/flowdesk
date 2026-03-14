import type { Comments } from "@/type/comments";
import { ArrowDownUp, ChevronDown } from "lucide-react";

const CommentsHeader = ({ comments }: { comments: Comments[] }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-end gap-2">
        <h4 className="text-xl font-medium">Kommentare</h4>
        <span className="text-accent font-semibold">{comments.length}</span>
      </div>

      <button className="text-sm flex items-center gap-1">
        <ArrowDownUp className="size-4 text-surface/90" /> Neuste Zuerst{" "}
        <ChevronDown className="size-4 text-surface/90" />
      </button>
    </div>
  );
};
export default CommentsHeader;
