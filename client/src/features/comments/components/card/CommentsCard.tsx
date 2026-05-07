import { Button } from "@/shared/components/ui/button";
import OverviewCard from "@/shared/components/ui/overview-card/OverviewCard";
import OverviewCardBody from "@/shared/components/ui/overview-card/OverviewCardBody";
import OverviewCardFooter from "@/shared/components/ui/overview-card/OverviewCardFooter";
import OverviewCardHeader from "@/shared/components/ui/overview-card/OverviewCardHeader";
import { Plus } from "lucide-react";
import OverviewCommentsList from "@/features/comments/components/card/OverviewCommentsList";
import type { OverviewCommentDto } from "@shared/types/dto/projects/projectOverview.dto";

type CommentsCardProps = {
  comments: OverviewCommentDto[];
  onMore: () => void;
};

const CommentsCard = ({ comments, onMore }: CommentsCardProps) => {
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
        <OverviewCommentsList comments={comments} />
      </OverviewCardBody>
      <OverviewCardFooter onClick={onMore} />
    </OverviewCard>
  );
};
export default CommentsCard;
