import { Button } from "@/components/ui/button";
import OverviewCard from "../ui/OverviewCard";
import OverviewCardBody from "../ui/OverviewCardBody";
import OverviewCardFooter from "../ui/OverviewCardFooter";
import OverviewCardHeader from "../ui/OverviewCardHeader";
import { Plus } from "lucide-react";
import type { Comment } from "@shared/types/comment";
import OverviewCommentsList from "./OverviewCommentsList";

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
