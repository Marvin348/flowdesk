import { Button } from "@/shared/components/ui/button";
import OverviewCard from "@/shared/components/ui/overview-card/OverviewCard";
import OverviewCardBody from "@/shared/components/ui/overview-card/OverviewCardBody";
import OverviewCardFooter from "@/shared/components/ui/overview-card/OverviewCardFooter";
import OverviewCardHeader from "@/shared/components/ui/overview-card/OverviewCardHeader";
import { Plus } from "lucide-react";
import type { Comment } from "@shared/types/comment";
import OverviewCommentsList from "@/features/comments/components/card/OverviewCommentsList";

type CommentsCardProps = {
  comments: Comment[];
  onMore: () => void;
};

const CommentsCard = ({ comments, onMore }: CommentsCardProps) => {
  const maxComments = comments.slice(0, 5);

  return (
    <OverviewCard>
      <OverviewCardHeader
        title="Kommentare"
        action={
          <Button onClick={onMore}>
            <Plus className="text-accent" /> <span>Kommentare</span>
          </Button>
        }
      />
      <OverviewCardBody>
        <OverviewCommentsList comments={maxComments} />
      </OverviewCardBody>
      <OverviewCardFooter onClick={onMore} />
    </OverviewCard>
  );
};
export default CommentsCard;
