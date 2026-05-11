import CommentForm from "@/features/comments/components/CommentForm";
import { ArrowDown } from "lucide-react";
import CommentsHeader from "@/features/comments/components/card/CommentsHeader";
import CommentThreadList from "@/features/comments/components/CommentThreadList";
import { useProjectComments } from "@/features/projects/hooks/details/useProjectComments";
import { useProjectCommentsSearchParams } from "@/features/projects/hooks/searchParams/useProjectCommentsSearchParams";
import { useState } from "react";

type CommentsViewProps = {
  projectId: string;
};

const CommentsView = ({ projectId }: CommentsViewProps) => {
  const [limit, setLimit] = useState(8);

  const { commentsSort, toggleCommentsSort } = useProjectCommentsSearchParams();

  const input = {
    projectId,
    limit,
    sort: commentsSort,
  };

  const { data, isLoading, error } = useProjectComments(input);

  const comments = data?.comments ?? [];
  const taskOptions = data?.taskOptions ?? [];
  const hasMore = data?.hasMore;

  if (isLoading) return <div>loading</div>;
  if (error) return <div>Etwas ist schief gelaufen</div>;
  if (!data) return <div>Project not found</div>;

  const onLoadMore = () => {
    setLimit((prev) => prev + 8);
  };

  console.log("COMMENTS", data);

  return (
    <section>
      <div className="border-b pb-8">
        <CommentForm taskOptions={taskOptions} projectId={projectId}/>
      </div>

      <div className="my-8">
        <CommentsHeader
          commentsSort={commentsSort}
          commentsCount={data.totalItems}
          toggleOrder={() => toggleCommentsSort()}
        />
      </div>

      <div>
        <CommentThreadList comments={comments} projectId={projectId}/>
      </div>

      {hasMore && (
        <button
          className="flex items-center m-auto gap-1 text-muted-foreground text-sm hover:text-foreground"
          onClick={onLoadMore}
        >
          Mehr Anzeigen <ArrowDown className="size-4" />
        </button>
      )}
    </section>
  );
};
export default CommentsView;
