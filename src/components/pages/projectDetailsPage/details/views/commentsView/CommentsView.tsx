import CommentForm from "@/components/pages/projectDetailsPage/details/views/commentsView/CommentForm";
import { ArrowDown, ArrowDownUp, ChevronDown } from "lucide-react";
import type { Comments } from "@/type/comments";
import { useState } from "react";
import CommentsHeader from "./CommentsHeader";
import CommentThreadList from "./CommentThreadList";

type CommentsViewProps = {
  comments: Comments[];
};

const CommentsView = ({ comments }: CommentsViewProps) => {
  const COMMENTS_PER_PAGE = 10;

  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);

  const maxComments = comments.slice(0, visibleCount);
  return (
    <>
      <div className="border-b pb-8">
        <CommentForm />
      </div>

      <div className="my-8">
        <CommentsHeader comments={comments} />
      </div>

      <div>
        {/* <CommentsList comments={maxComments} /> */}
        <CommentThreadList comments={maxComments} />
      </div>

      {visibleCount < comments.length && (
        <button
          className="flex items-center gap-1 text-accent hover:text-accent/90"
          onClick={() => setVisibleCount((prev) => prev + COMMENTS_PER_PAGE)}
        >
          Mehr Anzeigen <ArrowDown className="size-5" />
        </button>
      )}
    </>
  );
};
export default CommentsView;
