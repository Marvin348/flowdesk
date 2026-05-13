import OverviewCommentItem from "@/features/comments/components/card/OverviewCommentItem";
import type { OverviewCommentDto } from "@shared/types/dto/projects/projectOverview.dto";

const OverviewCommentsList = ({ comments }: { comments: OverviewCommentDto[] }) => {
  return (
    <div className="p-4 h-full">
      {comments.map((com) => (
        <OverviewCommentItem key={com.id} comment={com} />
      ))}
      {comments.length === 0 && (
        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
          Keine Kommentare
        </div>
      )}
    </div>
  );
};
export default OverviewCommentsList;
