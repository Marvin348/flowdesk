import CommentForm from "@/features/comments/components/CommentForm";
import { ArrowDown } from "lucide-react";
import CommentsHeader from "@/features/comments/components/card/CommentsHeader";
import CommentThreadList from "@/features/comments/components/CommentThreadList";
import type { TaskWithMeta } from "@/features/tasks/types/taskWithMeta";
import { useProjectComments } from "@/features/projects/hooks/details/useProjectComments";

export type SortOrder = "newest" | "oldest";

type CommentsViewProps = {
  projectId: string;
};

const CommentsView = ({ projectId }: CommentsViewProps) => {
  const { data, isLoading, error } = useProjectComments(projectId);

  if (isLoading) return <div>loading</div>;
  if (error) return <div>Etwas ist schief gelaufen</div>;
  if (!data) return <div>Project not found</div>;

  console.log("COMMENTS", data);

  const comments = data.comments;
  const taskOptions = data.taskOptions;

  return (
    <section>
      <div className="border-b pb-8">
        <CommentForm taskOptions={taskOptions} />
      </div>

      {/* <div className="my-8">
        <CommentsHeader
          comments={allComments}
          toggleOrder={toggleSortOrder}
          sortOrder={sortOrder}
        />
      </div> */}

      <div>
        <CommentThreadList comments={comments} />
      </div>

      {/* {visibleCount < allComments.length && (
        <button
          className="flex items-center m-auto gap-1 text-accent text-sm hover:text-accent/90"
          onClick={() => setVisibleCount((prev) => prev + COMMENTS_PER_PAGE)}
        >
          Mehr Anzeigen <ArrowDown className="size-4" />
        </button>
      )} */}
    </section>
  );
};
export default CommentsView;
