import CommentForm from "@/components/pages/projectDetailsPage/details/views/commentsView/CommentForm";
import { ArrowDown } from "lucide-react";
import { useState } from "react";
import CommentsHeader from "./CommentsHeader";
import CommentThreadList from "./CommentThreadList";
import type { TaskWithMeta } from "@/type/view-models/taskWithMeta";

type CommentsViewProps = {
  tasks: TaskWithMeta[];
};

const CommentsView = ({ tasks }: CommentsViewProps) => {
  const COMMENTS_PER_PAGE = 8;
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);

  const allComments = tasks.flatMap((task) => task.comments);
  const maxComments = allComments.slice(0, visibleCount);

  return (
    <>
      <div className="border-b pb-8">
        <CommentForm tasks={tasks}/>
      </div>

      <div className="my-8">
        <CommentsHeader comments={allComments} />
      </div>

      <div>
        <CommentThreadList comments={maxComments} tasks={tasks} />
      </div>

      {visibleCount < allComments.length && (
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
