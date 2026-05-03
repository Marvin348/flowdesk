import OverviewCard from "@/shared/components/ui/overview-card/OverviewCard";
import OverviewCardBody from "@/shared/components/ui/overview-card/OverviewCardBody";
import OverviewCardFooter from "@/shared/components/ui/overview-card/OverviewCardFooter";
import OverviewCardHeader from "@/shared/components/ui/overview-card/OverviewCardHeader";
import Collaborator from "@/features/users/components/card/Collaborator";
import type { User } from "@shared/types/user";
import { UserRoundPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type CollaboratorsCardProps = {
  collaborators: User[];
  inviteOpen: () => void;
  onMore: () => void;
};

const CollaboratorsCard = ({
  collaborators,
  inviteOpen,
  onMore,
}: CollaboratorsCardProps) => {
  return (
    <OverviewCard>
      <OverviewCardHeader
        title="Mitarbeiter"
        action={
          <Button onClick={inviteOpen}>
            <UserRoundPlus className="text-accent" />
            <span>Einladen</span>
          </Button>
        }
      />
      <OverviewCardBody>
        <div className="grid grid-cols-1 max-h-60 p-4 overflow-y-auto custom-scrollbar">
          {collaborators.map((user) => (
            <div
              key={user.id}
              className="flex items-center py-2 gap-2 border-b last:border-none"
            >
              <Collaborator user={user} />
            </div>
          ))}
        </div>
      </OverviewCardBody>
      <OverviewCardFooter onClick={onMore} />
    </OverviewCard>
  );
};
export default CollaboratorsCard;
