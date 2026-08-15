import { Button } from "@/shared/components/ui/button";
import OverviewCard from "@/shared/components/ui/overview-card/OverviewCard";
import OverviewCardBody from "@/shared/components/ui/overview-card/OverviewCardBody";
import OverviewCardFooter from "@/shared/components/ui/overview-card/OverviewCardFooter";
import OverviewCardHeader from "@/shared/components/ui/overview-card/OverviewCardHeader";
import { Plus } from "lucide-react";
import OverviewCommentsList from "@/features/comments/components/card/OverviewCommentsList";
import type { OverviewCommentDto } from "@shared/types/dto/projects/projectOverview.dto";
import { Link } from "react-router";

type CommentsCardProps = {
  comments: OverviewCommentDto[];
};

const CommentsCard = ({ comments }: CommentsCardProps) => {
  return (
    <OverviewCard>
      <OverviewCardHeader
        title="Kommentare"
        action={
          <Button asChild variant="accentOutline">
            <Link to="../comments">
              <Plus /> <span>Kommentare</span>
            </Link>
          </Button>
        }
      />
      <OverviewCardBody>
        <OverviewCommentsList comments={comments} />
      </OverviewCardBody>
      <OverviewCardFooter to="../comments" />
    </OverviewCard>
  );
};
export default CommentsCard;
