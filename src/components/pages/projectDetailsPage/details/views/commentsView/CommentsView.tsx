import CommentForm from "@/components/pages/projectDetailsPage/details/views/commentsView/CommentForm";
import { ArrowDown } from "lucide-react";
import { useState } from "react";
import CommentsHeader from "./CommentsHeader";
import CommentThreadList from "./CommentThreadList";
import type { TaskWithMeta } from "@/type/view-models/taskWithMeta";
import { getSortedComments } from "@/utils/comments/getSortedComments";

export type SortOrder = "newest" | "oldest";

const CommentsView = ({ tasks }: { tasks: TaskWithMeta[] }) => {
  const COMMENTS_PER_PAGE = 8;
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const allComments = tasks.flatMap((task) => task.comments);

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));

  const sortedComments = getSortedComments(allComments, sortOrder);

  const maxComments = sortedComments.slice(0, visibleCount);

  return (
    <section>
      <div className="border-b pb-8">
        <CommentForm tasks={tasks} />
      </div>

      <div className="my-8">
        <CommentsHeader
          comments={allComments}
          toggleOrder={toggleSortOrder}
          sortOrder={sortOrder}
        />
      </div>

      <div>
        <CommentThreadList comments={maxComments} tasks={tasks} />
      </div>

      {visibleCount < allComments.length && (
        <button
          className="flex items-center m-auto gap-1 text-accent text-sm hover:text-accent/90"
          onClick={() => setVisibleCount((prev) => prev + COMMENTS_PER_PAGE)}
        >
          Mehr Anzeigen <ArrowDown className="size-4" />
        </button>
      )}
    </section>
  );
};
export default CommentsView;
