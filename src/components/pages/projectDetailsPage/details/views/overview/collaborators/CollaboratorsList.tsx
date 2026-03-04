import { Button } from "@/components/ui/button";
import type { User } from "@/type/user";
import { UserRoundPlus } from "lucide-react";
import Collaborator from "@/components/pages/projectDetailsPage/details/views/overview/collaborators/Collaborator";

type CollaboratorsListProps = {
  collaborators: User[];
  inviteOpen: () => void;
};

const CollaboratorsList = ({
  collaborators,
  inviteOpen,
}: CollaboratorsListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-4 bg-muted-foreground/10 p-4">
        <h4 className="text-lg font-medium">Mitarbeiter</h4>
        <Button onClick={inviteOpen}>
          <UserRoundPlus className="text-accent" />
          <span>Einladen</span>
        </Button>
      </div>

      <div className="flex-1 relative">
        <div className="grid grid-cols-1 p-4 max-h-60 overflow-y-auto custom-scrollbar">
          {collaborators.map((user) => (
            <div
              key={user.id}
              className="flex items-center py-2 gap-2 border-b last:border-none"
            >
              <Collaborator user={user} />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="pb-4 px-4">
        <Button
          variant="outline"
          className="w-full hover:bg-muted-foreground/5"
        >
          Alle Ansehen ({collaborators.length})
        </Button>
      </div>
    </div>
  );
};
export default CollaboratorsList;
