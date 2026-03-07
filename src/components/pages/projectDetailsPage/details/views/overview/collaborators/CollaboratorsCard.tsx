import OverviewCard from "../ui/OverviewCard";
import OverviewCardBody from "../ui/OverviewCardBody";
import OverviewCardFooter from "../ui/OverviewCardFooter";
import OverviewCardHeader from "../ui/OverviewCardHeader";
import Collaborator from "./Collaborator";
import type { User } from "@/type/user";
import { UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type CollaboratorsCardProps = {
  collaborators: User[];
  inviteOpen: () => void;
};

const CollaboratorsCard = ({
  collaborators,
  inviteOpen,
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
      <OverviewCardFooter />
    </OverviewCard>
  );
};
export default CollaboratorsCard;
