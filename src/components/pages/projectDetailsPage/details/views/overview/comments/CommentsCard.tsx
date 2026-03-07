import { Button } from "@/components/ui/button";
import OverviewCard from "../ui/OverviewCard";
import OverviewCardBody from "../ui/OverviewCardBody";
import OverviewCardFooter from "../ui/OverviewCardFooter";
import OverviewCardHeader from "../ui/OverviewCardHeader";
import { Plus } from "lucide-react";
import Comment from "./Comment";
import type { CommentsWithUser } from "@/type/commentsWithUser";
import { useUsers } from "@/queries/users/useUsers";
import { useMemo } from "react";

type CommentsCardProps = {
  comments: CommentsWithUser[];
};

const CommentsCard = ({ comments }: CommentsCardProps) => {
  const { data: users = [] } = useUsers();

  const userByIds = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );
  return (
    <OverviewCard>
      <OverviewCardHeader
        title="Kommentare"
        action={
          <Button>
            <Plus className="text-accent" /> <span>Kommentare</span>
          </Button>
        }
      />
      <OverviewCardBody>
        <div className="p-4 h-full overflow-y-auto custom-scrollbar">
          {comments.map((com) => {
            const user = userByIds.get(com.userId);

            return (
              <div
                key={com.id}
                className="flex gap-2 border-b last:border-none py-2"
              >
                <Comment comment={com} user={user} />
              </div>
            );
          })}
          {comments.length === 0 && (
            <div className="h-full flex items-center justify-center">
              Keine Kommentare
            </div>
          )}
        </div>
      </OverviewCardBody>
      <OverviewCardFooter />
    </OverviewCard>
  );
};
export default CommentsCard;
